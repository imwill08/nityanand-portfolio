import React from 'react';
import { FaGithub, FaBook } from 'react-icons/fa';

const GithubCard = ({ data }) => {
  if (!data) return null;

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
          <FaGithub className="text-2xl text-[var(--accent)]" /> GitHub
        </h2>
        <div
          className="text-xs px-2.5 py-1 rounded"
          style={{
            fontFamily: 'var(--mono)',
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
          }}
        >
          {data.total_commits_last_30_days} Commits / 30d
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Col: User Profile */}
        <div className="flex items-center gap-4 min-w-[220px]">
          <a href={`https://github.com/${data.username}`} target="_blank" rel="noreferrer">
            <img
              src={data.avatar_url}
              alt="GitHub Avatar"
              className="w-16 h-16 rounded-md object-cover transition-opacity duration-200 hover:opacity-80"
              style={{
                border: '1px solid var(--border)',
              }}
            />
          </a>
          <div>
            <a href={`https://github.com/${data.username}`} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors">
              <h3 className="text-lg font-medium text-white">{data.username}</h3>
            </a>
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
              <FaBook size={12} /> {data.public_repos?.length || 0} Repos
            </div>
          </div>
        </div>

        {/* Right Col: Top Languages */}
        <div className="flex-1 w-full">
          <h4 className="text-xs mb-2.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
            Top Languages
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.top_languages && Object.entries(data.top_languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([lang]) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 text-xs rounded"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-dim)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--mono)'
                  }}
                >
                  {lang}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubCard;
