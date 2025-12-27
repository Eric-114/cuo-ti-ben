
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListTodo, 
  BrainCircuit, 
  Download, 
  Upload, 
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Menu,
  X
} from 'lucide-react';
import { Mistake, ViewType, FilterOptions, ReasonType } from './types';
import Sidebar from './components/Sidebar';
import MistakeList from './components/MistakeList';
import MistakeForm from './components/MistakeForm';
import StatsDashboard from './components/StatsDashboard';
import ReviewMode from './components/ReviewMode';

const STORAGE_KEY = 'elite_notebook_data';

const App: React.FC = () => {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMistakes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
    }
  }, [mistakes, isLoaded]);

  // Typeset MathJax whenever mistakes or view changes
  // Added casting to any to fix TypeScript "Property 'MathJax' does not exist" error
  useEffect(() => {
    const mathJax = (window as any).MathJax;
    if (mathJax && mathJax.typesetPromise) {
      mathJax.typesetPromise();
    }
  }, [mistakes, currentView]);

  const addMistake = (mistake: Omit<Mistake, 'id' | 'createdAt' | 'isMastered'>) => {
    const newMistake: Mistake = {
      ...mistake,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isMastered: false
    };
    setMistakes(prev => [newMistake, ...prev]);
    setCurrentView('list');
  };

  const updateMistake = (id: string, updates: Partial<Mistake>) => {
    setMistakes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMistake = (id: string) => {
    if (confirm('确定要删除这条错题吗？')) {
      setMistakes(prev => prev.filter(m => m.id !== id));
    }
  };

  const toggleMastery = (id: string) => {
    setMistakes(prev => prev.map(m => 
      m.id === id ? { ...m, isMastered: !m.isMastered } : m
    ));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(mistakes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'mistakes.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setMistakes(imported);
          alert('数据导入成功！');
        }
      } catch (err) {
        alert('导入失败，请检查文件格式。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white notion-shadow sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="font-bold text-gray-800">Elite Notebook</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-40 w-64 bg-white notion-shadow transition-transform duration-300 ease-in-out md:relative md:translate-x-0 no-print
      `}>
        <Sidebar 
          activeView={currentView} 
          onViewChange={setCurrentView} 
          onExport={exportData} 
          onImport={handleImport}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        {currentView === 'list' && (
          <MistakeList 
            mistakes={mistakes} 
            onToggleMastery={toggleMastery}
            onDelete={deleteMistake}
            onEdit={(m) => { /* Future: Implement full edit form */ }}
          />
        )}
        {currentView === 'add' && (
          <MistakeForm onSubmit={addMistake} />
        )}
        {currentView === 'stats' && (
          <StatsDashboard mistakes={mistakes} />
        )}
        {currentView === 'review' && (
          <ReviewMode mistakes={mistakes} onToggleMastery={toggleMastery} />
        )}
      </main>
    </div>
  );
};

export default App;
