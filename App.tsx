import React, { useState, useCallback } from 'react';
import { AppView, HistoryItem } from './types';
import Header from './components/Header';
import Home from './views/Home';
import ComposeView from './views/ComposeView';
import RestoreView from './views/RestoreView';
import HistoryPanel from './components/HistoryPanel';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
    <div className="bg-stone-50 text-stone-800 min-h-screen flex flex-col items-center antialiased transition-colors duration-500">
      <Header setView={setCurrentView} />
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="transition-opacity duration-500">
            {renderView()}
        </div>
      </main>
      <HistoryPanel history={history} />
      <footer className="w-full text-center p-4 text-stone-500 text-sm">
        <p>&copy; 2024 감성 스튜디오 AI. 모든 권리 보유.</p>
      </footer>
    </div>
  );
};

export default App;