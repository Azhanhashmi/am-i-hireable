import React, { useState } from 'react';
import { FormData, Mode, Tier } from '../types';
import { HiOutlineHome } from "react-icons/hi2";

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  error: string | null;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, error }) => {
  const [githubUsername, setGithubUsername] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [mode, setMode] = useState<Mode>('startup');
  const [tier, setTier] = useState<Tier>('tier2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim() || !leetcodeUsername.trim()) return;
    onSubmit({ githubUsername: githubUsername.trim(), leetcodeUsername: leetcodeUsername.trim(), mode, tier });
  };

  return (
    // ↓ Remove any default body margin via this wrapper — flush to viewport edges
    <div className="min-h-screen flex flex-col" style={{ margin: 0, padding: 0 }}>

      {/* ── Navbar ── flush to top, no extra vertical padding */}
      <nav className="flex items-center justify-between px-6 bg-cream"
        style={{ paddingTop: '10px', paddingBottom: '10px' }}  // tighter than py-4 (16px)
      >
        <div className="flex items-center gap-3">
          <div className="brutal-card px-3 py-1.5 bg-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success inline-block border border-ink"></span>
            <span className="font-bold text-xl font-mono"><HiOutlineHome/></span>
          </div>
          <div className="brutal-card px-3 py-1.5 bg-golden flex items-center gap-2 text-sm font-bold">
            <span>⚡</span>
            <span>BETA VERSION</span>
          </div>
        </div>
      <a href="https://github.com/azhanhashmi/am-i-hireable"
  target="_blank"
  rel="noopener noreferrer"
  className="brutal-card px-4 py-1.5 bg-sky font-bold text-sm"
>
  CONTRIBUTE →
</a>
      </nav>

      {/* ── Hero ── pt-6 brings card very close to navbar, like the reference */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-1 pb-16">

        {/* Giant title block */}
        <div className="relative mb-8 w-full max-w-4xl">
          {/* Main white card */}
          <div className="relative brutal-card bg-white shadow-none">
            {/* Yellow vertical bar on the right */}
            <div className="absolute -right-[14px] top-0 bottom-0 w-3.5 bg-golden border-l-[3px] border-ink z-10" />
            {/* Yellow horizontal bar at bottom */}
            <div className="absolute left-0 right-0 -bottom-[14px] h-3.5 bg-golden border-t-[3px] border-ink z-10" />

            <div className="px-10 pt-10 pb-8 text-center">
              <h1
                className="font-display leading-none text-ink"
                style={{ fontSize: 'clamp(64px, 12vw, 108px)', letterSpacing: '0.02em' }}
              >
                SKILL
              </h1>
              <h1
                className="font-display leading-none text-ink"
                style={{ fontSize: 'clamp(64px, 12vw, 108px)', letterSpacing: '0.02em' }}
              >
                ANALYZER
              </h1>
              <div className="flex items-center justify-center gap-3 mt-1">
                <h2
                  className="font-display text-punch leading-none"
                  style={{ fontSize: 'clamp(40px, 9vw, 80px)', letterSpacing: '0.02em' }}
                >
                  HIREABLE?
                </h2>
                <span style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}>⚡</span>
              </div>
            </div>
          </div>

          {/* NO SUGARCOATING tag overlapping bottom-right */}
          <div className="absolute -bottom-5 right-6 z-20 bg-ink text-cream text-xs font-bold px-3 py-1.5 border-[2.5px] border-ink font-mono tracking-widest">
            NO SUGARCOATING
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-ink-soft font-sans text-base md:text-lg font-medium max-w-lg mb-10 leading-relaxed">
          The high-fidelity protocol for developer identity analysis.
          Roast your profile, quantify your readiness, and upgrade your career trajectory.
        </p>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          {/* Username inputs side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* GitHub input */}
            <div className="brutal-card bg-white p-4">
              <label className="block text-xs font-bold font-mono uppercase tracking-widest text-ink mb-2">
                GITHUB TARGET
              </label>
              <div className="flex items-center gap-2">
                <span className="text-punch font-bold font-mono text-lg">$</span>
                <div className="w-px h-6 bg-ink opacity-40" />
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="username"
                  className="flex-1 bg-transparent outline-none font-mono font-semibold text-sm text-ink placeholder-gray-400"
                  autoComplete="off"
                />
                <span className="brutal-tag bg-cream text-ink text-[10px]">GH</span>
              </div>
            </div>

            {/* LeetCode input */}
            <div className="brutal-card bg-white p-4">
              <label className="block text-xs font-bold font-mono uppercase tracking-widest text-ink mb-2">
                LEETCODE TARGET
              </label>
              <div className="flex items-center gap-2">
                <span className="text-punch font-bold font-mono text-lg">$</span>
                <div className="w-px h-6 bg-ink opacity-40" />
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="username"
                  className="flex-1 bg-transparent outline-none font-mono font-semibold text-sm text-ink placeholder-gray-400"
                  autoComplete="off"
                />
                <span className="brutal-tag bg-cream text-ink text-[10px]">LC</span>
              </div>
            </div>
          </div>

          {/* Mode selector */}
          <div className="brutal-card bg-white p-4 mb-4 !cursor-default hover:transform-none hover:shadow-[6px_6px_0px_#111111]">
            <label className="block text-xs font-bold font-mono uppercase tracking-widest text-ink mb-3">
              SCAN MODE
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['startup', 'product'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`brutal-btn py-3 text-sm font-bold tracking-wide uppercase ${
                    mode === m ? 'btn-punch' : 'btn-white'
                  }`}
                >
                  {m === 'startup' ? '⚡ STARTUP MODE' : '🏢 PRODUCT MODE'}
                </button>
              ))}
            </div>
          </div>

          {/* Tier selector — only product mode */}
          {mode === 'product' && (
           <div className="brutal-card bg-white p-4 mb-4 animate-slide-up !cursor-default hover:transform-none hover:shadow-[6px_6px_0px_#111111]">
              <label className="block text-xs font-bold font-mono uppercase tracking-widest text-ink mb-3">
                TARGET TIER
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(
                  [
                    { value: 'tier1', label: 'TIER 1', sub: 'Google / Microsoft / Amazon', color: 'btn-punch' },
                    { value: 'tier2', label: 'TIER 2', sub: 'Zepto / Razorpay / CRED', color: 'btn-gold' },
                    { value: 'tier3', label: 'TIER 3', sub: 'Funded Startups', color: 'btn-sky' },
                  ] as { value: Tier; label: string; sub: string; color: string }[]
                ).map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTier(t.value)}
                    className={`brutal-btn py-3 flex-col gap-1 text-xs font-bold ${
                      tier === t.value ? t.color : 'btn-white'
                    }`}
                  >
                    <span className="font-bold text-sm">{t.label}</span>
                    <span className={`font-normal text-[11px] ${tier === t.value ? 'opacity-90' : 'text-ink-soft'}`}>
                      {t.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="brutal-card bg-danger/10 border-danger p-4 mb-4 animate-slide-up">
              <p className="text-danger font-bold font-mono text-sm">⚠ ERROR: {error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!githubUsername.trim() || !leetcodeUsername.trim()}
            className="brutal-btn btn-punch w-full py-5 text-lg font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            SCAN ⚡
          </button>
        </form>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {['AI Deep Analysis', 'GitHub Signals', 'LeetCode DSA', 'Roast Mode', 'Action Plan'].map((f) => (
            <span key={f} className="brutal-tag bg-white text-ink text-[11px]">
              {f}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InputForm;