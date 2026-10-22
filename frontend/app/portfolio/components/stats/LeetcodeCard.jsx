import React from 'react';

const LeetcodeCard = ({ data }) => {
  if (!data) return null;

  const totalPossible = 3300;
  const percentage = data.totalSolved ? Math.min((data.totalSolved / totalPossible) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 40; // r=40 -> 251.32
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="glass-card flex flex-col gap-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-xl font-normal flex items-center gap-2.5 text-white" style={{ fontFamily: 'var(--serif)' }}>
          <span className="w-8 h-8 rounded flex items-center justify-center text-[var(--accent)]" style={{
            background: 'var(--accent-soft)',
            border: '1px solid var(--border)',
          }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.607 2.6 2.6 0 0 1 .612-.476l3.864-4.081 4.708-4.756c.54-.54.54-1.414 0-1.955A1.374 1.374 0 0 0 13.483 0zm-2.88 7.283a1.376 1.376 0 0 0-.986.403l-4.23 4.28a1.376 1.376 0 0 0 0 1.955 1.376 1.376 0 0 0 1.95 0l4.23-4.28a1.376 1.376 0 0 0-.964-2.358z"/>
            </svg>
          </span>
          LeetCode
        </h2>
        <a
          href={`https://leetcode.com/${data.username}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs px-2.5 py-1 rounded transition-colors hover:text-[var(--text-bright)]"
          style={{
            fontFamily: 'var(--mono)',
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
          }}
        >
          @{data.username} ↗
        </a>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circle Progress */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <circle 
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-medium text-[var(--text-bright)]" style={{ fontFamily: 'var(--serif)' }}>{data.totalSolved || 0}</span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>Solved</span>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className="p-3.5 rounded border flex flex-col justify-between"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-normal" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>Easy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-xl font-normal text-white" style={{ fontFamily: 'var(--serif)' }}>{data.easySolved || 0}</span>
          </div>

          <div
            className="p-3.5 rounded border flex flex-col justify-between"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-normal" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>Medium</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
            </div>
            <span className="text-xl font-normal text-white" style={{ fontFamily: 'var(--serif)' }}>{data.mediumSolved || 0}</span>
          </div>

          <div
            className="p-3.5 rounded border flex flex-col justify-between"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-normal" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>Hard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70" />
            </div>
            <span className="text-xl font-normal text-white" style={{ fontFamily: 'var(--serif)' }}>{data.hardSolved || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetcodeCard;
