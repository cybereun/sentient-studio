
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-serif text-stone-900">Recent Creations</h2>
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{history.length} ITEMS</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {history.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl shadow-md bg-white aspect-square mb-3">
                <img 
                src={item.imageUrl} 
                alt={item.prompt} 
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
            <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-stone-700 truncate pr-2">{item.type}</p>
                <p className="text-[10px] text-stone-400">{new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
