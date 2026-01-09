
import React, { useState, useEffect, useCallback } from 'react';
import { ImageData, HistoryItem, OperationType } from '../types';
import { restoreImage } from '../services/geminiService';
import ImageUploader from '../components/ImageUploader';
import LoadingIndicator from '../components/LoadingIndicator';
import ResultDisplay from '../components/ResultDisplay';

interface RestoreViewProps {
    addToHistory: (item: HistoryItem) => void;
}

type UpscaleOption = 'none' | '2x' | '4x';

const RestoreView: React.FC<RestoreViewProps> = ({ addToHistory }) => {
    const [image, setImage] = useState<ImageData | null>(null);
    const [options, setOptions] = useState({
        restore: true,
        colorize: true,
        upscale: '2x' as UpscaleOption,
    });
    const [prompt, setPrompt] = useState<string>("");
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateOptimizedPrompt = useCallback(() => {
        const parts = [];
        if (options.restore) {
            parts.push("이미지의 긁힘, 찢어짐, 빛바램 등 모든 손상을 완벽하게 복원하고 선명도를 높여주세요.");
        }
        if (options.colorize) {
            parts.push("흑백 사진이라면 세피아 톤이 아닌, 풍부하고 생생한 현실적인 색상으로 채색해주세요. 각 사물과 배경에 가장 어울리는 다채로운 색을 입혀주세요.");
        }
        if (options.upscale !== 'none') {
            parts.push(`최종 결과물은 원본보다 ${options.upscale} 더 선명하게 업스케일링해주세요.`);
        }
        if (parts.length === 0) {
            return "이 사진을 개선해주세요.";
        }
        return parts.join(' ');
    }, [options]);

    useEffect(() => {
        setPrompt(generateOptimizedPrompt());
    }, [options, generateOptimizedPrompt]);
    
    const handleSubmit = async () => {
        if (!image) {
            setError("복원할 이미지를 업로드해주세요.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const finalPrompt = prompt || "이 사진을 복원하고 색을 입혀줘.";
            const imageUrl = await restoreImage(image.file, finalPrompt);
            setResult(imageUrl);
            addToHistory({
                id: crypto.randomUUID(),
                imageUrl,
                prompt: finalPrompt,
                type: OperationType.RESTORE,
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
                <h2 className="text-4xl font-bold text-stone-800">사진 복원 및 컬러화</h2>
                <p className="mt-2 text-lg text-stone-600 max-w-2xl mx-auto">오래된 추억에 새로운 숨결을 불어넣으세요. 빛바랜 사진을 업로드하면 AI가 예전의 영광을 되찾아 드립니다.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Column: Inputs */}
                <div className="w-full lg:w-5/12 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-stone-200 space-y-6">
                        <ImageUploader id="restore-image" title="오래된 사진 업로드" description="빛바래거나, 흑백이거나, 약간 손상된 사진에 가장 효과적입니다" onImageSelect={setImage} />
                        
                        {/* Restoration Options */}
                        <div className="space-y-5 bg-stone-50 p-5 rounded-lg border border-stone-100">
                            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide border-b border-stone-200 pb-2 mb-3">작업 옵션</h3>
                            
                            <div className="space-y-3">
                                <label className="flex items-center p-2 rounded hover:bg-white transition-colors cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={options.restore} 
                                        onChange={(e) => setOptions(prev => ({...prev, restore: e.target.checked}))} 
                                        className="h-5 w-5 text-rose-500 border-stone-300 rounded focus:ring-rose-500 transition duration-150 ease-in-out" 
                                    />
                                    <span className="ml-3 block text-stone-700 font-medium">손상 복원 (스크래치, 먼지 제거)</span>
                                </label>
                                <label className="flex items-center p-2 rounded hover:bg-white transition-colors cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={options.colorize} 
                                        onChange={(e) => setOptions(prev => ({...prev, colorize: e.target.checked}))} 
                                        className="h-5 w-5 text-rose-500 border-stone-300 rounded focus:ring-rose-500 transition duration-150 ease-in-out" 
                                    />
                                    <span className="ml-3 block text-stone-700 font-medium">자동 컬러화 (흑백 → 컬러)</span>
                                </label>
                            </div>

                            <div className="pt-2 border-t border-stone-200 mt-2">
                                <span className="block text-sm font-semibold text-stone-700 mb-3">해상도 업스케일링</span>
                                <div className="flex space-x-2">
                                    {(['none', '2x', '4x'] as UpscaleOption[]).map(value => (
                                        <label key={value} className={`flex-1 text-center py-2 text-sm rounded-md cursor-pointer border transition-all ${options.upscale === value ? 'bg-rose-100 border-rose-500 text-rose-700 font-bold' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                                            <input 
                                                type="radio" 
                                                name="upscale-option" 
                                                value={value} 
                                                checked={options.upscale === value} 
                                                onChange={() => setOptions(prev => ({ ...prev, upscale: value }))} 
                                                className="sr-only" 
                                            />
                                            {value === 'none' ? '원본 크기' : value}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="prompt-restore" className="block text-sm font-medium text-stone-700">AI 지시사항 (프롬프트)</label>
                                 <button
                                    onClick={() => setPrompt(generateOptimizedPrompt())}
                                    className="px-3 py-1 text-xs bg-stone-600 text-white font-semibold rounded hover:bg-stone-700 transition-colors"
                                >
                                    옵션대로 문구 자동생성
                                </button>
                            </div>
                            <textarea
                                id="prompt-restore"
                                rows={3}
                                className="w-full p-3 border border-stone-300 bg-white text-stone-800 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-stone-400 text-sm resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        
                        <div className="pt-2">
                             <button
                                onClick={handleSubmit}
                                disabled={isLoading || !image}
                                className="w-full py-4 bg-rose-500 text-white font-bold text-lg rounded-xl shadow-md hover:bg-rose-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
                            >
                                {isLoading ? '복원 중...' : '내 사진 복원하기'}
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
                            <h3 className="text-2xl font-bold text-stone-800 mb-6 pl-2 border-l-4 border-rose-500">복원된 추억</h3>
                            <ResultDisplay imageUrl={result} prompt={prompt} />
                        </div>
                    ) : (
                        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-stone-100 rounded-2xl border-2 border-dashed border-stone-300 text-stone-400 p-8 text-center">
                            <div className="w-20 h-20 mb-4 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-stone-500 mb-2">복원할 준비가 되었습니다</h3>
                            <p className="max-w-md">왼쪽 패널에서 사진을 업로드하고 옵션을 선택한 후 <br/>'내 사진 복원하기' 버튼을 눌러주세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestoreView;
