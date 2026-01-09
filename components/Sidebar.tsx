
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onOpenSettings?: () => void;
}

const NavItem: React.FC<{ 
  label: string; 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode 
}> = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 group
      ${active 
        ? 'bg-stone-100 text-rose-500 border-r-4 border-rose-500' 
        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
      }`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </span>
    <span className={`font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onOpenSettings }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-stone-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] sticky top-0 z-50">
      <div className="p-8 pb-12">
        <h1 
          className="text-3xl font-bold font-serif cursor-pointer text-stone-900 tracking-tighter flex items-center gap-2"
          onClick={() => setView(AppView.HOME)}
        >
          <span>🌸</span>
          <span>Sentient<span className="text-rose-500">.</span></span>
        </h1>
        <p className="text-xs text-stone-400 mt-1 tracking-widest uppercase pl-9">AI Creative Studio</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <NavItem 
          label="홈" 
          active={currentView === AppView.HOME} 
          onClick={() => setView(AppView.HOME)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        />
        <NavItem 
          label="이미지 합성" 
          active={currentView === AppView.COMPOSE} 
          onClick={() => setView(AppView.COMPOSE)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <NavItem 
          label="사진 복원" 
          active={currentView === AppView.RESTORE} 
          onClick={() => setView(AppView.RESTORE)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <NavItem 
          label="결과물 보관" 
          active={currentView === AppView.ARCHIVE} 
          onClick={() => setView(AppView.ARCHIVE)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
        />
        {/* Settings Button */}
        <NavItem 
          label="설정" 
          active={false} 
          onClick={() => onOpenSettings && onOpenSettings()}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
