
import React, { useState, useCallback, useEffect } from 'react';
import { AppView, HistoryItem } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './views/Home';
import ComposeView from './views/ComposeView';
import RestoreView from './views/RestoreView';
import ArchiveView from './views/ArchiveView';
import ApiKeyModal from './components/ApiKeyModal';
import { getAllHistory, saveHistoryItem, deleteHistoryItem } from './services/historyService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load history from IndexedDB on mount
  useEffect(() => {
    const loadHistory = async () => {
        const items = await getAllHistory();
        setHistory(items);
    };
    loadHistory();
  }, []);

  const addToHistory = useCallback(async (item: HistoryItem) => {
    try {
        // Save to Persistent Storage
        await saveHistoryItem(item);
        
        // Update local state
        setHistory(prev => [item, ...prev]);
    } catch (error) {
        console.error("Failed to add history item:", error);
    }
  }, []);

  const removeFromHistory = useCallback(async (id: string) => {
    try {
        // Remove from Persistent Storage
        await deleteHistoryItem(id);
        
        // Update local state
        setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
        console.error("Failed to delete history item:", error);
        alert("삭제 중 문제가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.");
    }
  }, []);

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
                    {/* Keep components mounted to persist state, toggle visibility with CSS */}
                    <div style={{ display: currentView === AppView.HOME ? 'block' : 'none' }}>
                        <Home setView={setCurrentView} />
                    </div>
                    <div style={{ display: currentView === AppView.COMPOSE ? 'block' : 'none' }}>
                        <ComposeView addToHistory={addToHistory} />
                    </div>
                    <div style={{ display: currentView === AppView.RESTORE ? 'block' : 'none' }}>
                        <RestoreView addToHistory={addToHistory} />
                    </div>
                    <div style={{ display: currentView === AppView.ARCHIVE ? 'block' : 'none' }}>
                        <ArchiveView history={history} onDelete={removeFromHistory} />
                    </div>
                </div>
                
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
