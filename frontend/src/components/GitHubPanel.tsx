import React from 'react';
import { GitHubSignals } from '../types';

interface GitHubPanelProps { signals: GitHubSignals; }

const consistencyBg: Record<string, string> = {
  excellent: '#22c55e',
  good: '#00b4d8',
  moderate: '#f5c518',
  poor: '#ef4444',
};

const GitHubPanel: React.FC<GitHubPanelProps> = ({ signals }) => {
  const accountYears = (signals.accountAgeDays / 365).toFixed(1);
  const lastActive = signals.lastCommitDate
    ? new Date(signals.lastCommitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A';

  const stats = [
    { label: 'TOTAL REPOS', value: signals.totalRepos, bg: 'bg-white' },
    { label: 'ORIGINAL', value: signals.originalRepos, bg: 'bg-white' },
    { label: 'FORKED', value: signals.forkedRepos, bg: 'bg-white' },
    { label: 'LIVE LINKS', value: signals.reposWithLiveLinks, bg: 'bg-sky/20' },
    { label: 'WITH README', value: signals.reposWithReadme, bg: 'bg-white' },
    { label: 'TUTORIAL REPOS', value: signals.tutorialRepos, bg: 'bg-white' },
    { label: 'REAL PROJECTS', value: signals.realProjectRepos, bg: 'bg-success/20' },
    { label: 'TOTAL STARS ⭐', value: signals.totalStars, bg: 'bg-golden/30' },
  ];

  return (
    <div className="brutal-card bg-white p-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-ink">
        <span className="text-2xl">🐙</span>
        <div>
          <div className="font-bold text-sm uppercase tracking-widest">GITHUB</div>
          <div className="text-xs text-ink-soft font-mono">{signals.mostUsedLanguage || "-"} User </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {stats.map((s) => (
          <div key={s.label} className={`border-2 border-ink p-2 ${s.bg}`}>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wide text-ink-soft mb-0.5">{s.label}</div>
            <div className="text-xl font-black text-ink">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-ink/20 pb-1">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">LANGUAGES</span>
          <span className="text-xs font-semibold text-right max-w-[180px] truncate">
            {signals.languages.slice(0, 5).join(', ') || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-ink/20 pb-1">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">COMMIT CONSISTENCY</span>
          <span
            className="brutal-tag text-[10px] text-ink"
            style={{ background: consistencyBg[signals.commitConsistency] || '#e5e5e5' }}
          >
            {signals.commitConsistency.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-ink/20 pb-1">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">LAST ACTIVE</span>
          <span className="text-xs font-bold">{lastActive}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-ink-soft uppercase">ACCOUNT AGE</span>
          <span className="text-xs font-bold">{accountYears} years</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubPanel;
