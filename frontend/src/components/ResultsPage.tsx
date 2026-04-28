import React, { useState} from 'react';
import { AnalysisResult, GitHubRepoDetail } from '../types';

import ScoreRing from './ScoreRing';
import ScoreBars from './ScoreBars';
import ShareCard from './ShareCard';

interface ResultsPageProps {
  result: AnalysisResult;
  onReset: () => void;
}

const verdictConfig = {
  Hired:     { bg: 'bg-success', text: '#111', shadow: '#15803d', label: 'HIRED',    emoji: '✅' },
  Close:     { bg: 'bg-golden',  text: '#111', shadow: '#a16207', label: 'CLOSE',    emoji: '⚡' },
  'Not Yet': { bg: 'bg-danger',  text: '#fff', shadow: '#991b1b', label: 'NOT YET',  emoji: '❌' },
};

const tierLabel: Record<string, string> = {
  tier1: 'TIER 1 — Google / Microsoft / Amazon',
  tier2: 'TIER 2 — Zepto / Razorpay / CRED',
  tier3: 'TIER 3 — Funded Startups',
};

// Language → color map for pie chart
const LANG_COLORS: Record<string, string> = {
  JavaScript:  '#f5c518',
  TypeScript:  '#00b4d8',
  Python:      '#3b82f6',
  CSS:         '#e91e8c',
  HTML:        '#f97316',
  Java:        '#ef4444',
  'C++':       '#8b5cf6',
  Go:          '#22c55e',
  Rust:        '#f59e0b',
  Ruby:        '#dc2626',
  PHP:         '#7c3aed',
  Swift:       '#f97316',
  Kotlin:      '#6366f1',
  Dart:        '#06b6d4',
  Shell:       '#84cc16',
};
const DEFAULT_COLORS = ['#e91e8c','#f5c518','#00b4d8','#22c55e','#8b5cf6','#f97316'];
const getLangColor = (lang: string, idx: number) => LANG_COLORS[lang] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

// Role detection based on languages + signals
const detectRole = (signals: AnalysisResult['githubSignals']): { role: string; secondary: string; confidence: number; reason: string } => {
  const langs = signals.languages.map(l => l.toLowerCase());

  const hasPython  = langs.includes('python');
  const hasJS      = langs.includes('javascript');
  const hasTS      = langs.includes('typescript');
  const hasJava    = langs.includes('java');
  const hasCpp     = langs.includes('c++') || langs.includes('c');
  const hasGo      = langs.includes('go');
  const hasRust    = langs.includes('rust');
  const hasML      = langs.some(l => ['jupyter notebook','r'].includes(l));

  if (hasPython && hasML) return { role: 'ML / AI Engineer', secondary: 'Data Scientist', confidence: 85, reason: 'Python + notebook usage signals ML/AI focus' };
  if (hasPython && !hasJS && !hasTS) return { role: 'Backend / Data Engineer', secondary: 'ML Engineer', confidence: 78, reason: 'Python-heavy with no frontend signals' };
  if (hasGo || hasRust) return { role: 'Systems / Backend Engineer', secondary: 'DevOps', confidence: 82, reason: 'Go/Rust usage signals systems-level work' };
  if (hasJava && hasCpp) return { role: 'Backend Engineer', secondary: 'Android Developer', confidence: 75, reason: 'Java + C++ stack signals backend or Android' };
  if ((hasJS || hasTS) && hasPython) return { role: 'Full-Stack Engineer', secondary: 'Backend Engineer', confidence: 80, reason: 'JS/TS + Python = full-stack or API developer' };
  if (hasTS && signals.reposWithLiveLinks > 3) return { role: 'Frontend Engineer', secondary: 'Full-Stack Engineer', confidence: 77, reason: 'TypeScript + multiple live deployments' };
  if (hasJS && signals.realProjectRepos > 5) return { role: 'Frontend / Full-Stack', secondary: 'React Developer', confidence: 72, reason: 'JavaScript with multiple real projects' };

  return { role: 'Software Engineer', secondary: 'Frontend Developer', confidence: 60, reason: 'Generalist profile — diversify your stack' };
};

// Projects to build based on weaknesses + role
const suggestProjects = (role: string, signals: AnalysisResult['githubSignals'], lc: AnalysisResult['leetcodeSignals']) => {
  const suggestions: { title: string; reason: string; difficulty: string; stack: string[] }[] = [];
  const r = role.toLowerCase();

  if (r.includes('ml') || r.includes('ai')) {
    suggestions.push({ title: 'Fine-tune a small LLM on custom dataset', reason: 'Shows practical AI/ML skills beyond theory', difficulty: 'Hard', stack: ['Python', 'HuggingFace', 'PyTorch'] });
    suggestions.push({ title: 'Build a RAG chatbot with PDF ingestion', reason: 'High demand in AI engineering roles', difficulty: 'Medium', stack: ['Python', 'LangChain', 'FastAPI'] });
  } else if (r.includes('full') || r.includes('backend')) {
    suggestions.push({ title: 'SaaS dashboard with auth + payments', reason: 'Proves full-stack capability end-to-end', difficulty: 'Hard', stack: ['Next.js', 'Prisma', 'Stripe'] });
    suggestions.push({ title: 'REST API with rate limiting + caching', reason: 'Backend depth often missing in portfolios', difficulty: 'Medium', stack: ['Node.js', 'Redis', 'PostgreSQL'] });
  } else {
    suggestions.push({ title: 'Interactive portfolio with case studies', reason: 'Frontend devs need polished live work', difficulty: 'Easy', stack: ['React', 'Framer Motion', 'Vercel'] });
    suggestions.push({ title: 'Real-time dashboard with WebSockets', reason: 'Shows you can handle live data', difficulty: 'Medium', stack: ['React', 'Socket.io', 'Node.js'] });
  }

  if (signals.reposWithLiveLinks < 3) {
    suggestions.push({ title: 'Deploy 2 existing projects to production', reason: `Only ${signals.reposWithLiveLinks} live projects — fix this fast`, difficulty: 'Easy', stack: ['Vercel', 'Railway', 'Netlify'] });
  }
  if (lc.totalSolved < 30) {
    suggestions.push({ title: '30-day LeetCode sprint (1 medium/day)', reason: `${lc.totalSolved} problems is below startup bar`, difficulty: 'Medium', stack: ['DSA', 'LeetCode', 'NeetCode'] });
  }

  return suggestions.slice(0, 4);
};

// ─── Heatmap component (shared for GitHub + LeetCode) ─────────────────────────
const ContributionHeatmap: React.FC<{ data: Record<string, number>; label: string; color: string }> = ({ data, label, color }) => {
  const today     = new Date();
  const days: { date: string; count: number }[] = [];

  for (let i = 364; i >= 0; i--) {
    const d    = new Date(today);
    d.setDate(d.getDate() - i);
    const key  = d.toISOString().split('T')[0];
    days.push({ date: key, count: data[key] || 0 });
  }

  const maxCount = Math.max(...days.map(d => d.count), 1);

  const getOpacity = (count: number) => {
    if (count === 0) return 0;
    return Math.max(0.15, count / maxCount);
  };

  // Group into weeks
  const weeks: { date: string; count: number }[][] = [];
  let week: { date: string; count: number }[] = [];
  days.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  const totalContributions = days.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold font-mono uppercase tracking-widest text-ink">{label}</span>
        <span className="brutal-tag bg-cream text-ink text-[10px]">{totalContributions} total</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]" style={{ minWidth: 'max-content' }}>
          {weeks.map((wk, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {wk.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.count}`}
                  className="w-3 h-3 border border-ink/20 cursor-default"
                  style={{
                    background: day.count === 0
                      ? 'rgba(17,17,17,0.06)'
                      : color,
                    opacity: day.count === 0 ? 1 : getOpacity(day.count),
                    borderColor: day.count > 0 ? 'rgba(17,17,17,0.3)' : 'rgba(17,17,17,0.1)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] font-mono text-ink-soft">Less</span>
        {[0.1, 0.3, 0.55, 0.75, 1].map((o, i) => (
          <div key={i} className="w-3 h-3 border border-ink/20" style={{ background: color, opacity: o }} />
        ))}
        <span className="text-[10px] font-mono text-ink-soft">More</span>
      </div>
    </div>
  );
};

// ─── Language Pie Chart ────────────────────────────────────────────────────────
const LanguagePieChart: React.FC<{ languageCount: Record<string, number> }> = ({ languageCount }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const entries = Object.entries(languageCount).sort((a, b) => b[1] - a[1]);
  const total   = entries.reduce((s, [, v]) => s + v, 0);

  if (total === 0) return <p className="text-sm text-ink-soft font-mono">No language data</p>;

  // Build SVG pie slices
  const cx = 80, cy = 80, r = 65, innerR = 38;
  let cumAngle = -Math.PI / 2;

  const slices = entries.map(([lang, count], idx) => {
    const pct   = count / total;
    const angle = pct * 2 * Math.PI;
    const x1    = cx + r * Math.cos(cumAngle);
    const y1    = cy + r * Math.sin(cumAngle);
    const x2    = cx + r * Math.cos(cumAngle + angle);
    const y2    = cy + r * Math.sin(cumAngle + angle);
    const ix1   = cx + innerR * Math.cos(cumAngle);
    const iy1   = cy + innerR * Math.sin(cumAngle);
    const ix2   = cx + innerR * Math.cos(cumAngle + angle);
    const iy2   = cy + innerR * Math.sin(cumAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const color = getLangColor(lang, idx);

    const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
    const slice = { lang, count, pct, color, path };
    cumAngle += angle;
    return slice;
  });

  const topLang = entries[0]?.[0] || '';

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* SVG donut */}
      <div className="flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              stroke="#111"
              strokeWidth={hovered === s.lang ? 2 : 1}
              style={{
                transform: hovered === s.lang ? `translate(${(cx - 80) * 0.05}px, ${(cy - 80) * 0.05}px)` : 'none',
                transition: 'stroke-width 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(s.lang)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {/* Center label */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#111" fontWeight="700">
            {hovered || topLang}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#111" fontWeight="900">
            {hovered
              ? `${Math.round((languageCount[hovered] / total) * 100)}%`
              : `${Math.round(((languageCount[topLang] || 0) / total) * 100)}%`}
          </text>
        </svg>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 w-full">
        {slices.slice(0, 6).map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setHovered(s.lang)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-3 h-3 border border-ink flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs font-mono font-bold text-ink flex-1">{s.lang}</span>
            <span className="text-xs font-mono text-ink-soft">{s.count} repos</span>
            <span className="text-xs font-mono font-bold text-ink">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Recent Repo Card ──────────────────────────────────────────────────────────
const RepoCard: React.FC<{ repo: GitHubRepoDetail }> = ({ repo }) => {
  const langEntries = Object.entries(repo.languagesBreakdown);
  const totalBytes  = langEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="brutal-card bg-white p-4 flex flex-col gap-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#111] transition-all duration-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold font-mono text-sm text-ink truncate">{repo.name}</span>
            {repo.isLive && (
              <span className="brutal-tag bg-success text-white text-[9px]">LIVE</span>
            )}
            {repo.hasReadme && (
              <span className="brutal-tag bg-sky text-ink text-[9px]">README</span>
            )}
          </div>
          {repo.description && (
            <p className="text-xs text-ink-soft mt-1 leading-snug line-clamp-2">{repo.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-xs font-mono">
          <span>⭐ {repo.stars}</span>
        </div>
      </div>

      {/* Language bar */}
      {langEntries.length > 0 && (
        <div className="flex h-2 border border-ink overflow-hidden">
          {langEntries.slice(0, 5).map(([lang, bytes], i) => (
            <div
              key={i}
              title={lang}
              style={{
                width: `${(bytes / totalBytes) * 100}%`,
                background: getLangColor(lang, i),
              }}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {repo.topics.slice(0, 3).map(t => (
            <span key={t} className="brutal-tag bg-cream text-ink text-[9px]">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-ink-soft">
          <span>{repo.recentCommits} commits/mo</span>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-tag bg-punch text-white text-[9px] hover:opacity-80"
            >
              VISIT →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main ResultsPage ──────────────────────────────────────────────────────────
const ResultsPage: React.FC<ResultsPageProps> = ({ result, onReset }) => {
  const vc         = verdictConfig[result.verdict] ?? verdictConfig['Not Yet'];
  const categories = [
    result.scores.category1,
    result.scores.category2,
    result.scores.category3,
    result.scores.category4,
  ].filter(Boolean);

  const roleData   = detectRole(result.githubSignals);
  const projects   = suggestProjects(roleData.role, result.githubSignals, result.leetcodeSignals);
  const langCount  = result.githubSignals.languageCount || {};

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-cream sticky top-0 z-50 border-b-[2.5px] border-ink">
        <div className="brutal-card px-3 py-1.5 bg-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success inline-block border border-ink" />
          <span className="font-bold text-sm font-mono">SKILL.ANALYZER</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="brutal-tag bg-cream text-ink text-[11px]">@{result.githubUsername}</span>
          <button onClick={onReset} className="brutal-btn btn-punch px-4 py-1.5 text-xs font-bold">
            ⚡ NEW SCAN
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-8 animate-fade-in">

        {/* ── VERDICT HERO ── */}
        <div className={`brutal-card ${vc.bg} p-8 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg,#111 0,#111 1px,transparent 0,transparent 50%)',
            backgroundSize: '8px 8px',
          }} />
          <div className="relative z-10">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3 opacity-70">FINAL VERDICT</div>
            <div className="font-display leading-none mb-4" style={{
              fontSize: 'clamp(64px,14vw,128px)',
              color: vc.text,
              textShadow: vc.text === '#fff' ? '2px 2px 0 #000' : '2px 2px 0 rgba(0,0,0,0.2)',
            }}>
              {vc.emoji} {vc.label}
            </div>
            <p className="text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: vc.text, opacity: 0.85 }}>
              {result.verdictExplanation}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <span className="brutal-tag bg-white text-ink text-[11px]">{result.mode.toUpperCase()} MODE</span>
              {result.tier && <span className="brutal-tag bg-white text-ink text-[11px]">{tierLabel[result.tier] || result.tier.toUpperCase()}</span>}
            </div>
          </div>
        </div>

        {/* ── SCORE + BREAKDOWN ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="brutal-card bg-white p-6">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink">OVERALL SCORE</div>
            <div className="flex justify-center py-2">
              <ScoreRing score={result.scores.overall} verdict={result.verdict} />
            </div>
          </div>
          <div className="brutal-card bg-white p-6">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink">SCORE BREAKDOWN</div>
            <ScoreBars categories={categories} />
          </div>
        </div>

        {/* ── ROAST ── */}
        <div className="brutal-card-punch p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b-2 border-ink bg-ink">
            <div className="w-2.5 h-2.5 rounded-full bg-danger border border-ink/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-golden border border-ink/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-success border border-ink/40" />
            <span className="ml-2 text-xs font-bold font-mono text-cream tracking-widest uppercase">ROAST</span>
            <span className="animate-cursor-blink text-punch ml-1 text-sm">▌</span>
          </div>
          <div className="p-6">
            <p className="text-ink font-semibold text-base leading-relaxed">{result.roast}</p>
          </div>
        </div>

        {/* ── ROLE FIT ── */}
        <div className="brutal-card bg-white p-6">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
            <span className="w-3 h-3 bg-sky border border-ink inline-block" />
            ROLE FIT ANALYSIS
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Primary role */}
            <div>
              <div className="text-[10px] font-mono text-ink-soft uppercase tracking-widest mb-2">BEST MATCH</div>
              <div className="brutal-card-gold p-4 mb-3">
                <div className="font-display text-2xl text-ink mb-1">{roleData.role.toUpperCase()}</div>
                <div className="text-xs font-mono text-ink-soft">{roleData.reason}</div>
              </div>
              {/* Confidence bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-soft">Confidence</span>
                <div className="flex-1 bar-track">
                  <div className="bar-fill-el" style={{ width: `${roleData.confidence}%`, background: '#f5c518' }} />
                </div>
                <span className="text-xs font-mono font-bold">{roleData.confidence}%</span>
              </div>
            </div>
            {/* Secondary role */}
            <div>
              <div className="text-[10px] font-mono text-ink-soft uppercase tracking-widest mb-2">SECONDARY FIT</div>
              <div className="brutal-card bg-white p-4 mb-3">
                <div className="font-display text-2xl text-ink mb-1">{roleData.secondary.toUpperCase()}</div>
                <div className="text-xs font-mono text-ink-soft">With some upskilling</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-soft">Confidence</span>
                <div className="flex-1 bar-track">
                  <div className="bar-fill-el" style={{ width: `${roleData.confidence - 15}%`, background: '#00b4d8' }} />
                </div>
                <span className="text-xs font-mono font-bold">{roleData.confidence - 15}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── LANGUAGE PIE CHART ── */}
        <div className="brutal-card bg-white p-6">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
            <span className="w-3 h-3 bg-golden border border-ink inline-block" />
            LANGUAGE BREAKDOWN
          </div>
          {Object.keys(langCount).length > 0
            ? <LanguagePieChart languageCount={langCount} />
            : <p className="text-sm text-ink-soft font-mono">No language data available</p>
          }
        </div>

        {/* ── CONTRIBUTION HEATMAPS ── */}
        <div className="grid md:grid-cols-1 gap-6">
          <div className="brutal-card bg-white p-6">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-success border border-ink inline-block" />
              GITHUB CONTRIBUTION HEATMAP
            </div>
            {Object.keys(result.githubSignals.contributionHeatmap || {}).length > 0
              ? <ContributionHeatmap data={result.githubSignals.contributionHeatmap} label="GitHub Commits — Last 365 Days" color="#22c55e" />
              : <p className="text-sm text-ink-soft font-mono">No heatmap data available</p>
            }
          </div>

          <div className="brutal-card bg-white p-6">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-golden border border-ink inline-block" />
              LEETCODE SUBMISSION HEATMAP
            </div>
            {Object.keys(result.leetcodeSignals.submissionHeatmap || {}).length > 0
              ? <ContributionHeatmap data={result.leetcodeSignals.submissionHeatmap} label="LeetCode Submissions — Last 365 Days" color="#f5c518" />
              : <p className="text-sm text-ink-soft font-mono">No submission data — start grinding!</p>
            }
          </div>
        </div>

        {/* ── RECENT REPOS ── */}
        {result.githubSignals.recentRepos?.length > 0 && (
          <div className="brutal-card bg-white p-6">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-punch border border-ink inline-block" />
              RECENT REPOSITORIES
              <span className="brutal-tag bg-cream text-ink text-[10px] ml-auto">TOP {result.githubSignals.recentRepos.length}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {result.githubSignals.recentRepos.map((repo, i) => (
                <RepoCard key={i} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* ── GITHUB + LEETCODE STATS ── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* GitHub stats */}
          <div className="brutal-card bg-white p-5">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-ink border border-ink inline-block" />
              GITHUB SIGNALS
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Repos',      value: result.githubSignals.totalRepos },
                { label: 'Real Projects',    value: result.githubSignals.realProjectRepos },
                { label: 'Live Deployments', value: result.githubSignals.reposWithLiveLinks },
                { label: 'Total Stars',      value: result.githubSignals.totalStars },
                { label: 'Monthly Commits',  value: result.githubSignals.monthlyCommits },
                { label: 'Commit Cadence',   value: result.githubSignals.commitConsistency.toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-ink/10 pb-2">
                  <span className="text-xs font-mono text-ink-soft">{label}</span>
                  <span className="text-sm font-bold font-mono text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LeetCode stats */}
          <div className="brutal-card bg-white p-5">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-golden border border-ink inline-block" />
              LEETCODE SIGNALS
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Solved',    value: result.leetcodeSignals.totalSolved },
                { label: 'Easy',            value: result.leetcodeSignals.easySolved },
                { label: 'Medium',          value: result.leetcodeSignals.mediumSolved },
                { label: 'Hard',            value: result.leetcodeSignals.hardSolved },
                { label: 'Active Days',     value: result.leetcodeSignals.totalActiveDays || 0 },
                { label: 'Current Streak',  value: `${result.leetcodeSignals.streak || 0} days` },
                { label: 'DSA Readiness',   value: result.leetcodeSignals.dsaReadiness.toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-ink/10 pb-2">
                  <span className="text-xs font-mono text-ink-soft">{label}</span>
                  <span className={`text-sm font-bold font-mono ${
                    label === 'DSA Readiness'
                      ? value === 'STRONG' ? 'text-success' : value === 'MODERATE' ? 'text-warn' : 'text-danger'
                      : 'text-ink'
                  }`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROJECTS TO BUILD ── */}
        <div className="brutal-card bg-white p-6">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
            <span className="w-3 h-3 bg-punch border border-ink inline-block" />
            PROJECTS YOU SHOULD BUILD
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p, i) => (
              <div key={i} className="border-2 border-ink p-4 bg-cream" style={{ boxShadow: '3px 3px 0 #111' }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-sm text-ink leading-snug">{p.title}</span>
                  <span className={`brutal-tag text-[9px] flex-shrink-0 ${
                    p.difficulty === 'Hard' ? 'bg-danger text-white' :
                    p.difficulty === 'Medium' ? 'bg-golden text-ink' : 'bg-success text-white'
                  }`}>{p.difficulty}</span>
                </div>
                <p className="text-xs text-ink-soft mb-3 leading-snug">{p.reason}</p>
                <div className="flex flex-wrap gap-1">
                  {p.stack.map(s => (
                    <span key={s} className="brutal-tag bg-white text-ink text-[9px]">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STRENGTHS + WEAKNESSES ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="brutal-card bg-white p-5">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-success border border-ink inline-block" />
              STRENGTHS
            </div>
            <ol className="space-y-3">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="brutal-tag bg-success text-white text-[10px] flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm font-medium text-ink leading-snug">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="brutal-card bg-white p-5">
            <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink flex items-center gap-2">
              <span className="w-3 h-3 bg-danger border border-ink inline-block" />
              WEAKNESSES
            </div>
            <ol className="space-y-3">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="brutal-tag bg-danger text-white text-[10px] flex-shrink-0 mt-0.5">✗</span>
                  <span className="text-sm font-medium text-ink leading-snug">{w}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── ACTION PLAN ── */}
        <div className="brutal-card bg-white p-5">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-5 pb-2 border-b-2 border-ink flex items-center gap-2">
            <span className="w-3 h-3 bg-punch border border-ink inline-block" />
            30 DAY ACTION PLAN
          </div>
          <div className="space-y-3">
            {result.actionPlan.map((step, i) => (
              <div key={i} className="flex items-start gap-4 border-2 border-ink p-4 bg-cream-dark" style={{ boxShadow: '3px 3px 0 #111' }}>
                <div className="flex-shrink-0 w-8 h-8 border-2 border-ink flex items-center justify-center font-black text-sm" style={{
                  background: ['#e91e8c','#f5c518','#00b4d8','#22c55e','#111'][i % 5],
                  color: i % 5 === 4 ? '#fff' : '#111',
                }}>
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-ink leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SHARE CARD ── */}
        <div className="brutal-card bg-white p-5">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-4 pb-2 border-b-2 border-ink flex items-center gap-2">
            <span className="w-3 h-3 bg-sky border border-ink inline-block" />
            EXPORT SHARE CARD
          </div>
          <p className="text-sm text-ink-soft mb-5">Generate a shareable card to flex on LinkedIn or X.</p>
          <div className="overflow-x-auto pb-2">
            <ShareCard result={result} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <button onClick={onReset} className="brutal-btn btn-punch px-10 py-4 text-base font-bold uppercase tracking-wider">
            ⚡ RUN NEW SCAN
          </button>
          <p className="text-xs text-ink-soft font-mono mt-4 uppercase tracking-widest">
            SKILL ANALYZER — All data is read-only and not stored
          </p>
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;
