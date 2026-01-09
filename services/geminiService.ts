
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result !== 'string') {
            return reject(new Error('FileReader가 문자열을 반환하지 않았습니다.'));
        }
        const base64String = reader.result.split(',')[1];
        resolve({ mimeType: file.type, data: base64String });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const extractImageFromResult = (response: any): string | null => {
    const parts = response?.candidates?.[0]?.content?.parts;
    if (!parts) return null;

    for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${part.inlineData.data}`;
        }
    }
    return null;
}

const translateToEnglish = async (text: string): Promise<string> => {
    if (!text) return "";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Translate the following Korean text to English. Return only the translated English text, without any additional explanations or introductory phrases.\n\nKorean text: "${text}"`,
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("영어로 번역 실패:", error);
        return text; // 번역 실패 시 원본 텍스트 반환
    }
};

export const generateCompositionPrompt = async (baseImageFile: File, objectImageFiles: File[]): Promise<string> => {
    try {
        const [baseImageData, ...objectImageDatas] = await Promise.all([
            fileToBase64(baseImageFile),
            ...objectImageFiles.map(file => fileToBase64(file)),
        ]);

        const promptForMetaModel = `
You are a 'Creative Director AI' that writes instructions for a photo editing AI.
Your task is to analyze a base image and several object images and write a single, clear, and specific instruction prompt in Korean for the editing AI.

**The prompt you generate MUST instruct the editing AI to:**
1.  **Integrate ALL Objects:** State that the subject in the base image must interact with *all* provided objects.
2.  **Specify Interactions for EACH Object:** Describe how the subject should interact with each object individually. Refer to the objects as "첫 번째 사물", "두 번째 사물", and so on. For example, instead of "use the objects," write "첫 번째 사물인 선글라스는 얼굴에 착용하고, 두 번째 사물인 책은 왼손에 들게 하세요." (The first object, sunglasses, should be worn on the face, and the second object, a book, should be held in the left hand).
3.  **Preserve Object Integrity:** Emphasize that the original design, color, and shape of the objects must NOT be changed.
4.  **Aim for Realism:** Mention the need for realistic lighting and shadows.

**Analyze the provided images and generate one detailed Korean sentence that meets all the above criteria.** Return ONLY the Korean text.

Example Output: "사진 속 인물이 첫 번째 사물인 선글라스는 착용하고, 두 번째 사물인 책은 왼손에 들고 있도록 사실적으로 합성해 주세요. 모든 사물의 원본 디자인은 절대 변경하지 마세요."
`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { text: promptForMetaModel },
                    { inlineData: { data: baseImageData.data, mimeType: baseImageData.mimeType } },
                    ...objectImageDatas.map(data => ({ inlineData: { data: data.data, mimeType: data.mimeType } })),
                ]
            },
        });

        return response.text || "";

    } catch (error) {
        console.error("프롬프트 생성 중 오류 발생:", error);
        throw new Error("AI 프롬프트 제안을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
}


export const composeImages = async (baseImageFile: File, objectImageFiles: File[], prompt: string): Promise<string> => {
    try {
        const [baseImageData, ...objectImageDatas] = await Promise.all([
            fileToBase64(baseImageFile),
            ...objectImageFiles.map(file => fileToBase64(file)),
        ]);
        
        const translatedPrompt = await translateToEnglish(prompt);

        const finalEnglishPrompt = `
You are a world-class photo editing AI. Your task is to perform a realistic composite of several images.

**IMAGE ROLES:**
- The VERY FIRST image provided is the main background scene (the [BASE IMAGE]).
- ALL subsequent images are objects (the [OBJECT IMAGES]) that must be masterfully integrated into the [BASE IMAGE].

**YOUR MISSION:**
You must follow the user's request precisely. The user's request is: "${translatedPrompt}"

**CRITICAL INSTRUCTIONS (NON-NEGOTIABLE):**
1.  **INCLUDE ALL OBJECTS:** Every single [OBJECT IMAGE] must be present in the final output. No exceptions. If you are given 3 images in total (1 base, 2 objects), the final image must contain the background and both objects.
2.  **THIS IS NOT A SIMPLE OVERLAY:** This is a photorealistic integration. You MUST alter the subject in the [BASE IMAGE] to make the interaction believable. For example, you must change the person's hands to realistically hold an object, or place glasses perfectly on their face. The interaction must look completely natural.
3.  **PRESERVE OBJECTS:** Do NOT alter the design, color, shape, or texture of the [OBJECT IMAGES]. They are fixed assets to be placed.
4.  **REALISM IS KEY:** The final image must have cohesive lighting, shadows, and perspective.
5.  **IMAGE OUTPUT ONLY:** Your only response is the final, high-resolution edited image. Do not output any text.
`;

        // The new structure: ALL images first, then the text prompt.
        // This is a more robust method for multi-image prompts with this model.
        const parts: any[] = [
            // 1. Provide all images.
            { inlineData: { data: baseImageData.data, mimeType: baseImageData.mimeType } },
            ...objectImageDatas.map(data => ({ inlineData: { data: data.data, mimeType: data.mimeType } })),
            // 2. Then provide the single, consolidated text prompt.
            { text: finalEnglishPrompt.trim() },
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imageUrl = extractImageFromResult(response);
        if (!imageUrl) {
            throw new Error("API가 이미지를 반환하지 않았습니다. 안전 정책에 의해 차단되었거나 AI가 요청을 수행할 수 없는 경우일 수 있습니다. 다른 이미지를 사용하거나 지시사항을 변경해 보세요.");
        }
        return imageUrl;

    } catch (error) {
        console.error("이미지 합성 중 오류 발생:", error);
        if (error instanceof Error) {
            if (error.message.includes("API가 이미지를 반환하지 않았습니다")) {
                throw error;
            }
        }
        throw new Error("이미지 합성에 실패했습니다. 입력 이미지나 프롬프트를 확인하시거나 잠시 후 다시 시도해주세요.");
    }
};

export const restoreImage = async (imageFile: File, prompt: string): Promise<string> => {
    try {
        const imageData = await fileToBase64(imageFile);
        const translatedPrompt = await translateToEnglish(prompt);
        
        const finalEnglishPrompt = `
You are an expert photo restoration AI. Your task is to restore the provided image according to the user's specific instructions.

**User's Request:** "${translatedPrompt}"

**Your Core Capabilities & Rules (Apply these when relevant to the user's request):**
1.  **When Colorizing:** You MUST use a rich, vibrant, and realistic color palette.
    -   **STRICTLY FORBIDDEN:** Absolutely no sepia tones, tinted monochrome, or desaturated filter effects. The goal is a full-color photograph, as if it were taken with a modern color camera.
    -   **METHOD:** Analyze the image content (sky, skin, clothing, objects) and apply distinct, appropriate, and lifelike colors to each element.
2.  **When Repairing Damage:** Fix all physical damage including scratches, tears, dust, and fading. Sharpen details and improve overall clarity significantly.
3.  **When Upscaling:** Enhance the image resolution as specified by the user (e.g., 2x, 4x), making it larger, clearer, and more detailed.

**Final Output:** Your ONLY response is the final, restored image. Do not output any text, descriptions, apologies, or explanations. Just the image.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageData.data, mimeType: imageData.mimeType } },
                    { text: finalEnglishPrompt.trim() },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imageUrl = extractImageFromResult(response);
        if (!imageUrl) {
            throw new Error("API가 이미지를 반환하지 않았습니다. 안전 정책에 의해 차단되었거나 요청이 복잡할 수 있습니다.");
        }
        return imageUrl;

    } catch (error) {
        console.error("이미지 복원 중 오류 발생:", error);
        throw new Error("이미지 복원에 실패했습니다. 입력 이미지나 프롬프트를 확인하시거나 잠시 후 다시 시도해주세요.");
    }
};
