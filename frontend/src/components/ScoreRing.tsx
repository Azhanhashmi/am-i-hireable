import React, { useEffect, useState } from 'react';
import { Verdict } from '../types';

interface ScoreRingProps {
  score: number;
  verdict: Verdict;
}

const verdictColor: Record<Verdict, string> = {
  Hired: '#22c55e',
  Close: '#f5c518',
  'Not Yet': '#ef4444',
};

const ScoreRing: React.FC<ScoreRingProps> = ({ score, verdict }) => {
  const [animated, setAnimated] = useState(false);
  const r = 72;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated ? score / 100 : 0) * circ;
  const color = verdictColor[verdict];

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="180" height="180">
          {/* Track */}
          <circle cx="90" cy="90" r={r} fill="none" stroke="#e5e5e5" strokeWidth="10" />
          {/* Ring */}
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="square"
            className="score-ring-circle"
            transform="rotate(-90 90 90)"
          />
          {/* Score text */}
          <text x="90" y="82" textAnchor="middle" fontSize="44" fontWeight="900" fontFamily="'Bebas Neue', sans-serif" fill="#111">
            {score}
          </text>
          <text x="90" y="104" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="'Space Grotesk', sans-serif" fill="#666">
            /100
          </text>
        </svg>
        {/* Corner brackets for brutalist framing */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ink" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-ink" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-ink" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ink" />
      </div>
      <div className="text-center">
        <div className="text-xs font-bold font-mono uppercase tracking-widest text-ink-soft">
          OVERALL READINESS
        </div>
      </div>
    </div>
  );
};

export default ScoreRing;
