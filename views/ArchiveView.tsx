
import React, { useState } from 'react';
import { HistoryItem } from '../types';

interface ArchiveViewProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
}

const ArchiveCard: React.FC<{ item: HistoryItem; onDelete: (id: string) => void }> = ({ item, onDelete }) => {
    const [copied, setCopied] = useState(false);

    const handleDownload = (e: React.MouseEvent, imageUrl: string, type: string) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `sentient-${type}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(item.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Immediate deletion without confirmation as requested
        onDelete(item.id);
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 transition-all duration-300 flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img 
                    src={item.imageUrl} 
                    alt={item.prompt} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-none">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                        {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        item.type === '이미지 합성' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                        {item.type}
                    </span>
                </div>
                
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-6 flex-1 font-light" title={item.prompt}>
                    {item.prompt}
                </p>

                <div className="flex gap-2 pt-4 border-t border-stone-100">
                    <button 
                        onClick={(e) => handleDownload(e, item.imageUrl, item.type)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-700 transition-colors"
                        title="이미지 저장"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        저장
                    </button>

                    <button 
                        onClick={handleCopy}
                        className={`w-12 flex items-center justify-center rounded-xl transition-colors ${copied ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-stone-100 text-stone-500 hover:bg-stone-200 border border-transparent'}`}
                        title="프롬프트 복사"
                    >
                         {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        )}
                    </button>
                    
                    <button 
                        onClick={handleDelete}
                        className="w-12 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                        title="삭제"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ history, onDelete }) => {
  if (history.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
            <div className="w-24 h-24 mb-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            </div>
            <h2 className="text-2xl font-serif text-stone-600 mb-2">보관함이 비어있습니다</h2>
            <p className="text-stone-400 font-light max-w-md">
                이미지 합성이나 사진 복원 작업을 진행하면 결과물이 이곳에 자동으로 안전하게 보관됩니다.
            </p>
        </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-stone-900 font-serif mb-4">Archive</h2>
        <p className="text-stone-500 text-lg font-light max-w-xl">
            생성된 모든 결과물을 안전하게 관리하세요. 브라우저 내에 저장되어 언제든 다시 확인할 수 있습니다.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {history.map((item) => (
          <ArchiveCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default ArchiveView;
