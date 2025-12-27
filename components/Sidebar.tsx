import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListTodo, 
  BrainCircuit, 
  Download, 
  Upload, 
  Printer
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onExport, onImport }) => {
  const menuItems = [
    { id: 'list', label: '错题列表', icon: <ListTodo size={20} /> },
    { id: 'add', label: '新增错题', icon: <PlusCircle size={20} /> },
    { id: 'review', label: '复习模式', icon: <BrainCircuit size={20} /> },
    { id: 'stats', label: '数据统计', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="hidden md:flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold notion-shadow">
          E
        </div>
        <div>
          <h1 className="font-bold text-gray-800 leading-tight">Elite Notebook</h1>
          <p className="text-xs text-gray-400">Personal Growth</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-10 pt-6 border-t border-gray-100 space-y-4">
        <button 
          onClick={() => window.print()}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Printer size={18} />
          <span>打印错题本</span>
        </button>
        <button 
          onClick={onExport}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Download size={18} />
          <span>备份数据 (JSON)</span>
        </button>
        <label className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
          <Upload size={18} />
          <span>恢复备份</span>
          <input type="file" className="hidden" accept=".json" onChange={onImport} />
        </label>
      </div>
      
      <div className="mt-auto pt-6 text-[10px] text-gray-400 text-center">
        © 2024 Elite Notebook v1.0
      </div>
    </div>
  );
};

export default Sidebar;