
import React, { useState, useMemo } from 'react';
// Added ListTodo to imports
import { Search, Filter, Trash2, CheckCircle, Circle, Star, ExternalLink, ListTodo } from 'lucide-react';
import { Mistake, FilterOptions, ReasonType } from '../types';
import { SUBJECTS, REASONS } from '../constants';

interface MistakeListProps {
  mistakes: Mistake[];
  onToggleMastery: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (mistake: Mistake) => void;
}

const MistakeList: React.FC<MistakeListProps> = ({ mistakes, onToggleMastery, onDelete, onEdit }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    subject: 'all',
    mastery: 'all'
  });

  const filteredMistakes = useMemo(() => {
    return mistakes.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                            m.solution.toLowerCase().includes(filters.search.toLowerCase());
      const matchesSubject = filters.subject === 'all' || m.subject === filters.subject;
      const matchesMastery = filters.mastery === 'all' || 
                             (filters.mastery === 'mastered' ? m.isMastered : !m.isMastered);
      return matchesSearch && matchesSubject && matchesMastery;
    });
  }, [mistakes, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
        <h2 className="text-2xl font-bold text-gray-800">错题库</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索题目或解析..." 
              className="pl-10 pr-4 py-2 bg-white notion-shadow border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <select 
            className="px-3 py-2 bg-white notion-shadow border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
          >
            <option value="all">所有科目</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="px-3 py-2 bg-white notion-shadow border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.mastery}
            onChange={(e) => setFilters({...filters, mastery: e.target.value as any})}
          >
            <option value="all">掌握程度</option>
            <option value="unmastered">未掌握</option>
            <option value="mastered">已掌握</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map(m => (
            <div key={m.id} className={`mistake-card p-6 rounded-2xl notion-shadow bg-white border-l-4 transition-all ${m.isMastered ? 'border-green-400 opacity-80' : 'border-blue-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">{m.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider">{m.reason}</span>
                    <div className="flex items-center text-yellow-400 ml-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < m.difficulty ? 'currentColor' : 'none'} className={i < m.difficulty ? '' : 'text-gray-200'} />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-2">{m.title}</h3>
                </div>
                <div className="flex items-center gap-2 no-print">
                   <button 
                    onClick={() => onToggleMastery(m.id)}
                    className={`p-2 rounded-full transition-colors ${m.isMastered ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={m.isMastered ? "设为未掌握" : "标记为已掌握"}
                  >
                    {m.isMastered ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <button onClick={() => onDelete(m.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {m.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-gray-100 max-h-64 flex justify-center bg-gray-50">
                    <img src={m.imageUrl} alt="Mistake illustration" className="object-contain max-w-full" />
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">解析步骤</h4>
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed math-content">
                    {m.solution}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-[10px] text-gray-400">
                <span>录入于 {new Date(m.createdAt).toLocaleDateString()}</span>
                {m.isMastered && <span className="text-green-500 font-medium">✨ 已完全掌握</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl notion-shadow opacity-50">
            <ListTodo size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">没有找到符合条件的错题</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MistakeList;
