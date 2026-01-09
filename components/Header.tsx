import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="text-2xl font-bold text-stone-800 cursor-pointer tracking-wider"
            onClick={() => setView(AppView.HOME)}
          >
            감성 스튜디오 <span className="text-rose-500">AI</span>
          </div>
          <nav>
            <button
              onClick={() => setView(AppView.HOME)}
              className="text-stone-600 hover:text-rose-500 transition-colors duration-300 font-medium"
            >
              홈
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;