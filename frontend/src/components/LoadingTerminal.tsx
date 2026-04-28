import React, { useState, useEffect } from 'react';

const LOGS = [
  { text: 'Connecting to GitHub API...', icon: '🔗' },
  { text: 'Fetching repository data...', icon: '📦' },
  { text: 'Analyzing commit patterns...', icon: '📊' },
  { text: 'Connecting to LeetCode...', icon: '🔗' },
  { text: 'Fetching problem solving data...', icon: '🧩' },
  { text: 'Calculating DSA readiness...', icon: '⚡' },
  { text: 'Running AI analysis engine...', icon: '🤖' },
  { text: 'Cross-referencing market signals...', icon: '📡' },
  { text: 'Generating verdict...', icon: '⚖️' },
  { text: 'Compiling final report...', icon: '📋' },
];

const LoadingTerminal: React.FC = () => {
  const [visible, setVisible] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= LOGS.length) return;
    const t = setTimeout(() => {
      setVisible((p) => [...p, idx]);
      setIdx((p) => p + 1);
    }, 750);
    return () => clearTimeout(t);
  }, [idx]);

  const pct = Math.min(Math.round((idx / LOGS.length) * 100), 98);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b-[2.5px] border-ink bg-cream">
        <div className="brutal-card px-3 py-1.5 bg-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success inline-block border border-ink"></span>
          <span className="font-bold text-sm font-mono">DEV.ANALYZER</span>
        </div>
        <div className="brutal-tag bg-golden text-ink">SCANNING...</div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="brutal-card bg-ink text-cream p-6 mb-6 text-center">
            <div
              className="font-display text-punch leading-none mb-2"
              style={{ fontSize: 'clamp(36px,8vw,64px)' }}
            >
              ANALYZING
            </div>
            <div className="font-mono text-sm text-cream/70">
              deep kernel scan in progress
              <span className="animate-cursor-blink">_</span>
            </div>
          </div>

          {/* Log terminal */}
          <div className="brutal-card bg-white p-5 mb-4 font-mono text-sm min-h-[280px]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-ink">
              <div className="w-3 h-3 rounded-full bg-danger border border-ink" />
              <div className="w-3 h-3 rounded-full bg-golden border border-ink" />
              <div className="w-3 h-3 rounded-full bg-success border border-ink" />
              <span className="ml-2 text-xs font-bold text-ink-soft tracking-widest uppercase">Terminal</span>
            </div>
            <div className="space-y-2">
              {LOGS.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    visible.includes(i) ? 'opacity-100 animate-log-line' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="text-base">{log.icon}</span>
                  <span className="text-ink-soft text-xs">{'>'}</span>
                  <span className={`text-xs ${i === visible[visible.length - 1] ? 'text-punch font-bold' : 'text-ink'}`}>
                    {log.text}
                  </span>
                  {visible.includes(i) && i < visible[visible.length - 1] && (
                    <span className="ml-auto brutal-tag bg-success text-white text-[10px]">OK</span>
                  )}
                  {i === visible[visible.length - 1] && idx < LOGS.length && (
                    <span className="ml-auto text-punch font-bold animate-cursor-blink text-xs">▌</span>
                  )}
                </div>
              ))}
              {idx >= LOGS.length && (
                <div className="mt-3 pt-3 border-t-2 border-ink flex items-center gap-2">
                  <span className="text-base">✅</span>
                  <span className="text-xs font-bold text-ink">Processing complete. Building report...</span>
                  <span className="ml-auto animate-cursor-blink text-punch">▌</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="brutal-card bg-white p-4">
            <div className="flex justify-between text-xs font-bold font-mono mb-2">
              <span>SCAN PROGRESS</span>
              <span className="text-punch">{pct}%</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill-el"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTerminal;
