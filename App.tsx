
import React, { useState, useCallback } from 'react';
import { AppView, HistoryItem } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './views/Home';
import ComposeView from './views/ComposeView';
import RestoreView from './views/RestoreView';
import HistoryPanel from './components/HistoryPanel';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 10)); // Keep last 10 items
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.COMPOSE:
        return <ComposeView addToHistory={addToHistory} />;
      case AppView.RESTORE:
        return <RestoreView addToHistory={addToHistory} />;
      case AppView.HOME:
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCF8] text-stone-800 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header for Mobile */}
        <Header setView={setCurrentView} />

        <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="w-full max-w-[1600px] p-6 md:px-10 md:py-12 pb-32">
                <div className="animate-fade-in transition-all duration-500 ease-out">
                    {renderView()}
                </div>
                
                {history.length > 0 && (
                    <div className="mt-24 pt-12 border-t border-stone-200">
                        <HistoryPanel history={history} />
                    </div>
                )}
                
                <footer className="mt-20 text-center text-stone-400 text-xs tracking-widest uppercase">
                    &copy; 2026 Lebi Studio AI. All rights reserved.
                </footer>
            </div>
        </main>
      </div>
      
      {/* Settings Modal */}
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default App;
