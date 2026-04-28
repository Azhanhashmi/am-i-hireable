import React, { useRef } from 'react';
import { AnalysisResult } from '../types';

interface ShareCardProps { result: AnalysisResult; }

const verdictBg: Record<string, string> = {
  Hired: '#22c55e',
  Close: '#f5c518',
  'Not Yet': '#ef4444',
};

const ShareCard: React.FC<ShareCardProps> = ({ result }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#fdf6e3',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `dev-score-${result.githubUsername}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Share card failed:', err);
    }
  };

  const bg = verdictBg[result.verdict] || '#e5e5e5';
  const topWeakness = result.weaknesses[0] || '—';

  return (
    <div>
      {/* The actual share card */}
      <div
        ref={cardRef}
        style={{
          background: '#fdf6e3',
          border: '3px solid #111',
          boxShadow: '8px 8px 0 #111',
          padding: '24px',
          width: '480px',
          fontFamily: "'Space Grotesk', sans-serif",
          maxWidth: '100%',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '2px solid #111', paddingBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            SKILL.ANALYZER — SCAN REPORT
          </div>
          <div style={{ fontSize: '11px', background: '#111', color: '#fdf6e3', padding: '2px 8px', fontWeight: 700 }}>
            BETA
          </div>
        </div>

        {/* Usernames */}
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '16px', fontFamily: 'monospace' }}>
          GH: @{result.githubUsername} &nbsp;|&nbsp; LC: @{result.leetcodeUsername}
        </div>

        {/* Verdict + Score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ background: bg, border: '2.5px solid #111', padding: '8px 20px', boxShadow: '4px 4px 0 #111' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px', lineHeight: 1, color: '#111' }}>
              {result.verdict.toUpperCase()}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>VERDICT</div>
          </div>
          <div style={{ border: '2.5px solid #111', padding: '8px 20px', background: '#fff', boxShadow: '4px 4px 0 #e91e8c', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: 1, color: '#e91e8c' }}>
              {result.scores.overall}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>/100 SCORE</div>
          </div>
        </div>

        {/* Roast */}
        <div style={{ border: '2px solid #111', background: '#fff', padding: '10px 12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e91e8c', marginBottom: '4px' }}>
            REVIEW
          </div>
          <div style={{ fontSize: '11px', color: '#333', lineHeight: 1.5 }}>
            {result.roast.slice(0, 140)}{result.roast.length > 140 ? '...' : ''}
          </div>
        </div>

        {/* Top weakness */}
        <div style={{ border: '2px solid #ef4444', background: '#fef2f2', padding: '8px 12px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ef4444', marginBottom: '4px' }}>
            TOP ISSUE
          </div>
          <div style={{ fontSize: '11px', color: '#111' }}>{topWeakness}</div>
        </div>

        <div style={{ marginTop: '12px', fontSize: '9px', color: '#999', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          made by azhan
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="brutal-btn btn-ink w-full py-3 text-sm font-bold uppercase tracking-wider mt-4"
      >
        ⬇ DOWNLOAD SHARE CARD
      </button>
    </div>
  );
};

export default ShareCard;
