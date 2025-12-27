import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { Mistake, ReasonType } from '../types';
import { SUBJECTS, REASONS } from '../constants';

interface MistakeFormProps {
  onSubmit: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'isMastered'>) => void;
}

const MistakeForm: React.FC<MistakeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: SUBJECTS[0],
    reason: REASONS[0] as ReasonType,
    difficulty: 3,
    solution: '',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.solution) return;
    onSubmit(formData);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setFormData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">新增错题</h2>
        <p className="text-sm text-gray-500">记录你的盲点，让知识更牢固。</p>
      </div>

      <form onSubmit={handleSubmit} onPaste={handlePaste} className="space-y-6 bg-white p-8 rounded-2xl notion-shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">题目名称 / 描述</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="例如：二次函数对称轴计算错误"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">科目</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">错误原因</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value as ReasonType})}
              >
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">难度系数 (1-5星)</label>
            <input 
              type="range" min="1" max="5" step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={formData.difficulty}
              onChange={e => setFormData({...formData, difficulty: parseInt(e.target.value)})}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>简单</span>
              <span>普通</span>
              <span>极难</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">解析步骤 (支持 LaTeX 公式 $x^2$)</label>
            <textarea 
              required
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-mono text-sm"
              placeholder="详细写下解析过程或知识点。提示：可以使用 LaTeX 语法。"
              value={formData.solution}
              onChange={e => setFormData({...formData, solution: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">图片资料 (URL 或 粘贴截图)</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all pl-12"
                placeholder="粘贴图片链接，或直接在此框内 Ctrl+V 粘贴截图"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {formData.imageUrl && (
              <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 p-2">
                <img src={formData.imageUrl} className="max-h-48 rounded-lg mx-auto" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, imageUrl: ''})}
                  className="mt-2 text-xs text-red-500 block mx-auto hover:underline"
                >
                  移除图片
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold notion-shadow hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
        >
          <Send size={20} />
          <span>保存错题记录</span>
        </button>
      </form>
    </div>
  );
};

export default MistakeForm;