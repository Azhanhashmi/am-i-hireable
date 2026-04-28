import React from 'react';
import { LeetCodeSignals } from '../types';

interface LeetCodePanelProps { signals: LeetCodeSignals; }

const dsaBg: Record<string, string> = {
  weak: '#ef4444',
  moderate: '#f5c518',
  strong: '#22c55e',
};

const LeetCodePanel: React.FC<LeetCodePanelProps> = ({ signals }) => {
  return (
    <div className="brutal-card bg-white p-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-ink">
        <span className="text-2xl">🧩</span>
        <div>
          <div className="font-bold text-sm uppercase tracking-widest">LEETCODE</div>
          <div className="text-xs text-ink-soft font-mono">DSA Proficiency Scan</div>
        </div>
      </div>

      {/* Solved counts */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="border-2 border-ink p-3 text-center bg-white">
          <div className="text-[10px] font-bold font-mono text-ink-soft mb-0.5">TOTAL</div>
          <div className="text-2xl font-black text-ink">{signals.totalSolved}</div>
        </div>
        <div className="border-2 border-ink p-3 text-center bg-success/20">
          <div className="text-[10px] font-bold font-mono text-ink-soft mb-0.5">EASY</div>
          <div className="text-2xl font-black text-success">{signals.easySolved}</div>
        </div>
        <div className="border-2 border-ink p-3 text-center bg-golden/30">
          <div className="text-[10px] font-bold font-mono text-ink-soft mb-0.5">MEDIUM</div>
          <div className="text-2xl font-black" style={{ color: '#b8860b' }}>{signals.mediumSolved}</div>
        </div>
        <div className="border-2 border-ink p-3 text-center bg-danger/10">
          <div className="text-[10px] font-bold font-mono text-ink-soft mb-0.5">HARD</div>
          <div className="text-2xl font-black text-danger">{signals.hardSolved}</div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-ink/20 pb-1">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">DSA READINESS</span>
          <span
            className="brutal-tag text-[10px] text-ink"
            style={{ background: dsaBg[signals.dsaReadiness] || '#e5e5e5' }}
          >
            ● {signals.dsaReadiness.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-ink/20 pb-1">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">ACCEPTANCE RATE</span>
          <span className="text-xs font-bold">{typeof signals.acceptanceRate === 'number' ? `${signals.acceptanceRate.toFixed(1)}%` : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between border-b border-ink/20 pb-1">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">EASY/MEDIUM RATIO</span>
          <span className="text-xs font-bold">{typeof signals.easyToMediumRatio === 'number' ? signals.easyToMediumRatio.toFixed(2) : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">GLOBAL RANKING</span>
          <span className="text-xs font-bold">#{signals.ranking?.toLocaleString() || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodePanel;
