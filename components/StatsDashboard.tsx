import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Mistake } from '../types';
import { SUBJECTS } from '../constants';

Chart.register(...registerables);

interface StatsDashboardProps {
  mistakes: Mistake[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ mistakes }) => {
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!doughnutRef.current || !lineRef.current) return;

    // Subject Distribution
    const subjectCounts = SUBJECTS.map(s => ({
      label: s,
      count: mistakes.filter(m => m.subject === s).length
    })).filter(s => s.count > 0);

    const doughnutChart = new Chart(doughnutRef.current, {
      type: 'doughnut',
      data: {
        labels: subjectCounts.map(s => s.label),
        datasets: [{
          data: subjectCounts.map(s => s.count),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
            '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'
          ],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6, font: { size: 10 } } }
        }
      }
    });

    // Trend (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    const trendData = last7Days.map(dateStr => {
      return mistakes.filter(m => new Date(m.createdAt).toLocaleDateString() === dateStr).length;
    });

    const lineChart = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: last7Days.map(d => d.split('/')[1] + '/' + d.split('/')[2]),
        datasets: [{
          label: '录入数量',
          data: trendData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    return () => {
      doughnutChart.destroy();
      lineChart.destroy();
    };
  }, [mistakes]);

  const masteredCount = mistakes.filter(m => m.isMastered).length;
  const totalCount = mistakes.length;
  const masteryRate = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">学习看板</h2>
        <p className="text-sm text-gray-500">用数据洞察薄弱环节，精准提分。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl notion-shadow flex flex-col items-center justify-center text-center">
          <span className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-widest">总体掌握率</span>
          <div className="text-4xl font-black text-blue-600 mb-2">{masteryRate}%</div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${masteryRate}%`}}></div>
          </div>
          <span className="text-[10px] text-gray-400 mt-2">已掌握 {masteredCount} / 总计 {totalCount}</span>
        </div>
        
        <div className="md:col-span-2 bg-white p-6 rounded-2xl notion-shadow">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-widest">最近 7 天学习趋势</h3>
          <canvas ref={lineRef} height="100"></canvas>
        </div>

        <div className="bg-white p-6 rounded-2xl notion-shadow h-full flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-widest">各科目错题占比</h3>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <canvas ref={doughnutRef}></canvas>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl notion-shadow h-full">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-widest">建议复习科目</h3>
          <div className="space-y-4">
            {SUBJECTS.slice(0, 4).map(s => {
              const count = mistakes.filter(m => m.subject === s && !m.isMastered).length;
              if (count === 0) return null;
              return (
                <div key={s} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-700">{s}</span>
                  </div>
                  <span className="text-xs font-bold text-orange-500">{count} 道待复习</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;