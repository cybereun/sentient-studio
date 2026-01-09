
import React, { useState } from 'react';
import { ImageData, HistoryItem, OperationType } from '../types';
import { composeImages, generateCompositionPrompt } from '../services/geminiService';
import ImageUploader from '../components/ImageUploader';
import MultiImageUploader from '../components/MultiImageUploader';
import LoadingIndicator from '../components/LoadingIndicator';
import ResultDisplay from '../components/ResultDisplay';

interface ComposeViewProps {
    addToHistory: (item: HistoryItem) => void;
}

const ComposeView: React.FC<ComposeViewProps> = ({ addToHistory }) => {
    const [baseImage, setBaseImage] = useState<ImageData | null>(null);
    const [objectImages, setObjectImages] = useState<ImageData[]>([]);
    const [prompt, setPrompt] = useState<string>("사진 속 인물이 추가된 모든 사물과 자연스럽게 상호작용하도록 합성해주세요. 사물의 원본 디자인, 색상, 형태는 절대 변경하지 마세요.");
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

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

        try {
            const objectImageFiles = objectImages.map(img => img.file);
            const finalPrompt = prompt || "이미지들을 자연스럽게 합성해줘.";
            const imageUrl = await composeImages(baseImage.file, objectImageFiles, finalPrompt);
            setResult(imageUrl);
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
        <div className="w-full space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-stone-800">이미지 합성</h2>
                <p className="mt-2 text-lg text-stone-600 max-w-2xl mx-auto">기본 사진과 인물이 착용할 사물 사진(들)을 업로드하세요. AI가 자연스럽게 착용한 모습을 연출해 드립니다.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Column: Inputs */}
                <div className="w-full lg:w-5/12 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-stone-200 space-y-6">
                        <ImageUploader id="base-image" title="기본 이미지 업로드" description="인물이나 주체가 포함된 배경 사진" onImageSelect={setBaseImage} />

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">합성할 이미지 (인물이 착용하거나 사용할 사물)</label>
                            <div className="p-4 border border-stone-200 rounded-lg bg-stone-50 min-h-[10rem]">
                                <MultiImageUploader 
                                    images={objectImages} 
                                    onImagesChange={setObjectImages} 
                                    title="이미지 추가" 
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="prompt" className="block text-sm font-medium text-stone-700">AI 지시사항 (프롬프트)</label>
                                <button
                                    onClick={handleGeneratePrompt}
                                    disabled={!baseImage || objectImages.length === 0 || isGeneratingPrompt || isLoading}
                                    className="px-3 py-1 text-xs bg-stone-600 text-white font-semibold rounded hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isGeneratingPrompt ? '분석 중...' : 'AI 프롬프트 제안'}
                                </button>
                            </div>
                            <textarea
                                id="prompt"
                                rows={4}
                                className="w-full p-3 border border-stone-300 bg-white text-stone-800 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-stone-400 text-sm resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="예: 인물이 모자를 쓰고, 가방을 메고, 커피잔을 들고 있도록 해주세요."
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !baseImage || objectImages.length === 0}
                                className="w-full py-4 bg-rose-500 text-white font-bold text-lg rounded-xl shadow-md hover:bg-rose-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
                            >
                                {isLoading ? '합성 중...' : '내 장면 만들기'}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-red-600 bg-red-100 p-4 rounded-md text-center text-sm font-medium animate-pulse">{error}</div>}
                </div>

                {/* Right Column: Result */}
                <div className="w-full lg:w-7/12 flex flex-col">
                    {isLoading ? (
                         <div className="w-full h-[600px] flex items-center justify-center bg-white rounded-2xl border border-stone-200 shadow-sm">
                            <LoadingIndicator />
                        </div>
                    ) : result ? (
                        <div className="w-full">
                            <h3 className="text-2xl font-bold text-stone-800 mb-6 pl-2 border-l-4 border-rose-500">완성된 작품</h3>
                            <ResultDisplay imageUrl={result} prompt={prompt} />
                        </div>
                    ) : (
                        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-stone-100 rounded-2xl border-2 border-dashed border-stone-300 text-stone-400 p-8 text-center">
                            <div className="w-20 h-20 mb-4 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-stone-500 mb-2">작품을 만들 준비가 되었습니다</h3>
                            <p className="max-w-md">왼쪽 패널에서 기본 이미지와 사물 이미지를 업로드하고 <br/>'내 장면 만들기' 버튼을 눌러주세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComposeView;
