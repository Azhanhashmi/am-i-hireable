import React, { useEffect, useState } from 'react';
import { CategoryScore } from '../types';

interface ScoreBarsProps {
  categories: CategoryScore[];
}

const barColors = ['#e91e8c', '#f5c518', '#00b4d8', '#22c55e'];

const ScoreBars: React.FC<ScoreBarsProps> = ({ categories }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      {categories.map((cat, i) => {
        const pct = Math.round((cat.score / cat.max) * 100);
        const color = barColors[i % barColors.length];
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ink">{cat.name}</span>
              <span className="brutal-tag text-[11px]" style={{ background: color, borderColor: '#111', color: pct > 60 ? '#111' : '#111' }}>
                {cat.score}/{cat.max}
              </span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill-el"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  backgroundColor: color,
                  transitionDelay: `${i * 0.15}s`,
                }}
              />
              {/* Score label inside bar */}
              <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-bold font-mono text-ink pointer-events-none">
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScoreBars;
