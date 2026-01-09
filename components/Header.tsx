
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  return (
    <header className="md:hidden w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="text-xl font-bold font-serif text-stone-900 cursor-pointer tracking-tighter flex items-center gap-1"
            onClick={() => setView(AppView.HOME)}
          >
            <span>🌸</span>
            <span>Sentient<span className="text-rose-500">.</span></span>
          </div>
          <nav className="flex gap-4">
            <button
              onClick={() => setView(AppView.COMPOSE)}
              className="text-stone-600 hover:text-rose-500 transition-colors text-sm font-medium"
            >
              합성
            </button>
             <button
              onClick={() => setView(AppView.RESTORE)}
              className="text-stone-600 hover:text-rose-500 transition-colors text-sm font-medium"
            >
              복원
            </button>
             <button
              onClick={() => setView(AppView.ARCHIVE)}
              className="text-stone-600 hover:text-rose-500 transition-colors text-sm font-medium"
            >
              보관함
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
