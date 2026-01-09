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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">최근 작업물</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md aspect-w-1 aspect-h-1">
            <img 
              src={item.imageUrl} 
              alt={item.prompt} 
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                {item.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;