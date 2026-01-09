
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

    const handleReset = () => {
        if (window.confirm("모든 작업 내용을 초기화하시겠습니까?")) {
            setImage(null);
            setOptions({
                restore: true,
                colorize: true,
                upscale: '2x',
            });
            setResult(null);
            setError(null);
        }
    };
    
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
        <div className="w-full">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 font-serif mb-4">Restore</h2>
                    <p className="text-stone-500 text-lg font-light max-w-xl">오래된 사진에 새로운 생명과 색채를 불어넣으세요.</p>
                </div>
                 {(image || result) && (
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
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">Original Photo</h3>
                            <ImageUploader id="restore-image" title="사진 업로드" description="복원할 이미지를 선택하세요" onImageSelect={setImage} />
                            {image && (
                                <div className="mt-2 text-xs text-stone-500 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    이미지 로드됨: {image.file.name}
                                </div>
                            )}
                        </section>
                        
                        {/* Restoration Options */}
                        <section className="space-y-6">
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest pb-2 border-b border-stone-100">Enhancement Options</h3>
                            
                            <div className="space-y-4">
                                <label className="flex items-center group cursor-pointer">
                                    <div className="relative flex-shrink-0">
                                        <input 
                                            type="checkbox" 
                                            checked={options.restore} 
                                            onChange={(e) => setOptions(prev => ({...prev, restore: e.target.checked}))} 
                                            className="peer sr-only" 
                                        />
                                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                    </div>
                                    <span className="ml-3 text-stone-700 font-medium group-hover:text-stone-900">손상 복원 (Repair)</span>
                                </label>
                                <label className="flex items-center group cursor-pointer">
                                    <div className="relative flex-shrink-0">
                                        <input 
                                            type="checkbox" 
                                            checked={options.colorize} 
                                            onChange={(e) => setOptions(prev => ({...prev, colorize: e.target.checked}))} 
                                            className="peer sr-only" 
                                        />
                                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                    </div>
                                    <span className="ml-3 text-stone-700 font-medium group-hover:text-stone-900">컬러화 (Colorize)</span>
                                </label>
                            </div>

                            <div className="pt-2">
                                <span className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Upscale Resolution</span>
                                <div className="flex p-1 bg-stone-50 rounded-xl border border-stone-100">
                                    {(['none', '2x', '4x'] as UpscaleOption[]).map(value => (
                                        <label key={value} className={`flex-1 text-center py-2 text-sm rounded-lg cursor-pointer transition-all ${options.upscale === value ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-500 hover:text-stone-700'}`}>
                                            <input 
                                                type="radio" 
                                                name="upscale-option" 
                                                value={value} 
                                                checked={options.upscale === value} 
                                                onChange={() => setOptions(prev => ({ ...prev, upscale: value }))} 
                                                className="sr-only" 
                                            />
                                            {value === 'none' ? '1x' : value}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section>
                             <div className="flex justify-between items-end mb-4">
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Detail Prompt</h3>
                                <button
                                    onClick={() => setPrompt(generateOptimizedPrompt())}
                                    className="text-xs font-semibold text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    Reset to Default
                                </button>
                            </div>
                            <textarea
                                id="prompt-restore"
                                rows={3}
                                className="w-full p-4 bg-stone-50 border-0 rounded-xl text-stone-700 placeholder:text-stone-400 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all text-sm leading-relaxed resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </section>
                        
                        <div className="pt-4">
                             <button
                                onClick={handleSubmit}
                                disabled={isLoading || !image}
                                className="w-full py-5 bg-stone-900 text-white font-medium text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none transition-all duration-300 transform active:scale-[0.99]"
                            >
                                {isLoading ? 'Restoring...' : 'Start Restoration'}
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
                             <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4 text-right">Restored Memory</h3>
                            <ResultDisplay imageUrl={result} prompt={prompt} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-stone-100/50 rounded-3xl border-2 border-dashed border-stone-200 text-stone-400 p-12 text-center group hover:border-stone-300 transition-colors">
                            <div className="w-24 h-24 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-300 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-serif text-stone-600 mb-2">Awaiting Photo</h3>
                            <p className="font-light">Upload a photo to begin restoration.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestoreView;
