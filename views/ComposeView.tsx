
import React, { useState } from 'react';
import { ImageData, HistoryItem, OperationType } from '../types';
import { composeImages, generateCompositionPrompt, analyzeImage } from '../services/geminiService';
import ImageUploader from '../components/ImageUploader';
import MultiImageUploader from '../components/MultiImageUploader';
import LoadingIndicator from '../components/LoadingIndicator';
import ResultDisplay from '../components/ResultDisplay';

interface ComposeViewProps {
    addToHistory: (item: HistoryItem) => void;
}

const ComposeView: React.FC<ComposeViewProps> = ({ addToHistory }) => {
    const DEFAULT_PROMPT = "사진 속 인물이 추가된 모든 사물과 자연스럽게 상호작용하도록 합성해주세요. 사물의 원본 디자인, 색상, 형태는 절대 변경하지 마세요.";
    const [baseImage, setBaseImage] = useState<ImageData | null>(null);
    const [objectImages, setObjectImages] = useState<ImageData[]>([]);
    const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
    const [result, setResult] = useState<string | null>(null);
    const [resultPrompt, setResultPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

    const handleReset = () => {
        if (window.confirm("모든 작업 내용을 초기화하시겠습니까?")) {
            setBaseImage(null);
            setObjectImages([]);
            setPrompt(DEFAULT_PROMPT);
            setResult(null);
            setResultPrompt("");
            setError(null);
        }
    };

    const handleGeneratePrompt = async () => {
        if (!baseImage || objectImages.length === 0) {
            setError("AI 프롬프트 제안을 받으려면 기본 이미지와 하나 이상의 합성할 이미지를 업로드해야 합니다.");
            return;
        }
        setIsGeneratingPrompt(true);
        setError(null);

        try {
            const objectImageFiles = objectImages.map(img => img.file);
            const suggestedPrompt = await generateCompositionPrompt(baseImage.file, objectImageFiles);
            setPrompt(suggestedPrompt);
        } catch (err: any) {
            setError(err.message || "프롬프트 생성 중 예상치 못한 오류가 발생했습니다.");
        } finally {
            setIsGeneratingPrompt(false);
        }
    };
    
    const handleSubmit = async () => {
        if (!baseImage || objectImages.length === 0) {
            setError("기본 이미지와 하나 이상의 합성할 이미지를 업로드해주세요.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setResultPrompt("");

        try {
            const objectImageFiles = objectImages.map(img => img.file);
            const userPrompt = prompt || "이미지들을 자연스럽게 합성해줘.";
            const imageUrl = await composeImages(baseImage.file, objectImageFiles, userPrompt);
            
            // Analyze the generated image to get a descriptive prompt
            let finalPrompt = userPrompt;
            try {
                // If the user provided a prompt, we analyze the result to get a better description for history
                const analysis = await analyzeImage(imageUrl);
                if (analysis) {
                    finalPrompt = analysis;
                }
            } catch (e) {
                console.warn("Image analysis failed, using original prompt as fallback");
            }

            setResult(imageUrl);
            setResultPrompt(finalPrompt);

            addToHistory({
                id: crypto.randomUUID(),
                imageUrl,
                prompt: finalPrompt,
                type: OperationType.COMPOSE,
                timestamp: new Date().toISOString(),
            });
        } catch (err: any) {
            setError(err.message || "예상치 못한 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 font-serif mb-4">Compose</h2>
                    <p className="text-stone-500 text-lg font-light max-w-xl">기본 배경과 사물을 업로드하여 완벽한 장면을 연출하세요.</p>
                </div>
                {(baseImage || objectImages.length > 0 || result) && (
                    <button 
                        onClick={handleReset}
                        className="text-sm font-medium text-stone-400 hover:text-rose-500 transition-colors flex items-center gap-1 mb-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        초기화
                    </button>
                )}
            </header>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Left Column: Inputs */}
                <div className="w-full xl:w-5/12 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 space-y-8">
                        
                        <section>
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">1. Base Image</h3>
                            <ImageUploader id="base-image" title="배경 이미지 선택" description="메인 피사체가 포함된 사진" onImageSelect={setBaseImage} />
                            {baseImage && (
                                <div className="mt-2 text-xs text-stone-500 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    이미지 로드됨: {baseImage.file.name}
                                </div>
                            )}
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">2. Object Images</h3>
                            <div className="bg-stone-50 rounded-2xl p-2 border border-stone-100">
                                <MultiImageUploader 
                                    images={objectImages} 
                                    onImagesChange={setObjectImages} 
                                    title="사물 추가" 
                                />
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">3. Direction</h3>
                                <button
                                    onClick={handleGeneratePrompt}
                                    disabled={!baseImage || objectImages.length === 0 || isGeneratingPrompt || isLoading}
                                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 disabled:text-stone-300 transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    {isGeneratingPrompt ? 'Analyzing...' : 'Auto Generate'}
                                </button>
                            </div>
                            <textarea
                                id="prompt"
                                rows={4}
                                className="w-full p-4 bg-stone-50 border-0 rounded-xl text-stone-700 placeholder:text-stone-400 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all text-sm leading-relaxed resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="AI에게 구체적인 지시사항을 내려주세요..."
                            />
                        </section>
                        
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !baseImage || objectImages.length === 0}
                                className="w-full py-5 bg-stone-900 text-white font-medium text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none transition-all duration-300 transform active:scale-[0.99]"
                            >
                                {isLoading ? 'Processing...' : 'Generate Scene'}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-rose-600 bg-rose-50 p-4 rounded-xl text-center text-sm font-medium border border-rose-100 animate-pulse">{error}</div>}
                </div>

                {/* Right Column: Result */}
                <div className="w-full xl:w-7/12 flex flex-col min-h-[600px]">
                    {isLoading ? (
                         <div className="flex-1 flex items-center justify-center bg-white rounded-3xl border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <LoadingIndicator />
                        </div>
                    ) : result ? (
                        <div className="w-full animate-fade-in">
                            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 text-right">Final Output</h3>
                            {/* Display the analyzed prompt, or fallback to the input prompt if analysis is not yet ready or failed */}
                            <ResultDisplay imageUrl={result} prompt={resultPrompt || prompt} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-stone-100/50 rounded-3xl border-2 border-dashed border-stone-200 text-stone-400 p-12 text-center group hover:border-stone-300 transition-colors">
                            <div className="w-24 h-24 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-300 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-serif text-stone-600 mb-2">Ready to Create</h3>
                            <p className="font-light">Upload your assets on the left to begin the magic.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComposeView;
