
import React, { useState } from 'react';

interface ResultDisplayProps {
  imageUrl: string;
  prompt: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, prompt }) => {
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `sentient-studio-result-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy prompt:', err);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-stone-100 overflow-hidden group relative">
                 <img src={imageUrl} alt="Generated Result" className="w-full h-auto object-contain rounded-2xl" />
                 
                 <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleDownload}
                        className="flex items-center px-5 py-3 bg-white text-stone-900 font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>
                 </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Generation Prompt</span>
                    <button 
                        onClick={handleCopyPrompt}
                        className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 border ${copied ? 'bg-green-50 text-green-700 border-green-100' : 'bg-stone-50 text-stone-500 border-stone-100 hover:border-stone-200 hover:text-stone-800'}`}
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Copied
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                </div>
                <div className="text-stone-600 text-sm leading-relaxed break-words font-light">
                    {prompt}
                </div>
            </div>
        </div>
    );
};

export default ResultDisplay;
