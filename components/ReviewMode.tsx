import React, { useState, useMemo } from 'react';
import { RefreshCcw, Check, X, Star, BrainCircuit } from 'lucide-react';
import { Mistake } from '../types';

interface ReviewModeProps {
  mistakes: Mistake[];
  onToggleMastery: (id: string) => void;
}

const ReviewMode: React.FC<ReviewModeProps> = ({ mistakes, onToggleMastery }) => {
  const unmastered = useMemo(() => mistakes.filter(m => !m.isMastered), [mistakes]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentMistake = unmastered[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
        const next = Math.floor(Math.random() * unmastered.length);
        setCurrentIndex(next === currentIndex && unmastered.length > 1 ? (next + 1) % unmastered.length : next);
    }, 150);
  };

  const markMastered = () => {
    if (currentMistake) {
      onToggleMastery(currentMistake.id);
      nextCard();
    }
  };

  if (unmastered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">全部掌握！</h2>
        <p className="text-gray-500 max-w-sm">你已经消灭了所有的错题。继续努力，保持学习！</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col h-[80vh]">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">复习抽测</h2>
        <p className="text-sm text-gray-500">随机抽取未掌握的题目。点击卡片查看解析。</p>
        <div className="mt-4 inline-flex px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
          剩余 {unmastered.length} 道错题
        </div>
      </div>

      <div 
        className={`flex-1 relative cursor-pointer group perspective-1000 ${isFlipped ? 'card-flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-flip-inner relative w-full h-full duration-700 notion-shadow rounded-3xl overflow-hidden bg-white">
          {/* Front */}
          <div className="card-face absolute inset-0 bg-white p-10 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                {currentMistake.subject}
              </span>
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < currentMistake.difficulty ? 'currentColor' : 'none'} className={i < currentMistake.difficulty ? '' : 'text-gray-100'} />
                ))}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-8">
                {currentMistake.title}
              </h3>
              {currentMistake.imageUrl && (
                <div className="max-h-48 rounded-xl overflow-hidden mb-6 border border-gray-100">
                  <img src={currentMistake.imageUrl} className="max-h-full object-contain" alt="Question" />
                </div>
              )}
            </div>

            <div className="text-center text-xs text-gray-300 animate-pulse">
              点击翻面查看解析
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-back absolute inset-0 bg-white p-10 flex flex-col overflow-y-auto">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest border-b border-gray-50 pb-2">详细解析</h4>
            <div className="flex-1 text-gray-700 whitespace-pre-wrap leading-relaxed math-content">
              {currentMistake.solution}
            </div>
            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              <p className="text-xs text-orange-600 font-bold mb-1">错误原因：</p>
              <p className="text-sm text-orange-700">{currentMistake.reason}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-10">
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          className="w-14 h-14 bg-white notion-shadow text-gray-400 hover:text-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110"
          title="下一题"
        >
          <RefreshCcw size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); markMastered(); }}
          className="px-8 h-14 bg-green-500 notion-shadow text-white rounded-full flex items-center justify-center gap-2 font-bold transition-all hover:scale-105 hover:bg-green-600 active:scale-95"
          title="标记为掌握"
        >
          <Check size={20} />
          <span>我掌握了</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewMode;