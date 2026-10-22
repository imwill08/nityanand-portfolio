import React from "react";
import { FaStar, FaChartLine } from "react-icons/fa";
import CodeforcesGraph from "./CodeforcesGraph";

const CodeforcesCard = ({
  data,
  loading,
  borderColor,
}) => {
  const LoadingSkeleton = () => (
    <div className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
  );

  // Helper function to get rating color and title
  const getRatingInfo = (rating) => {
    if (!rating) return { color: "#9ca3af", title: "Unrated" };
    if (rating >= 3000) return { color: "#ef4444", title: "Legendary Grandmaster" };
    if (rating >= 2600) return { color: "#f87171", title: "International Grandmaster" };
    if (rating >= 2400) return { color: "#fb923c", title: "Grandmaster" };
    if (rating >= 2300) return { color: "#fbbf24", title: "International Master" };
    if (rating >= 2100) return { color: "#f87171", title: "Master" };
    if (rating >= 1900) return { color: "#c084fc", title: "Candidate Master" };
    if (rating >= 1600) return { color: "#60a5fa", title: "Expert" };
    if (rating >= 1400) return { color: "#2dd4bf", title: "Specialist" };
    if (rating >= 1200) return { color: "#4ade80", title: "Pupil" };
    return { color: "#9ca3af", title: "Newbie" };
  };

  const maxRatingInfo = getRatingInfo(data?.maxRating);
  const currentRatingInfo = getRatingInfo(data?.rating);

  return (
    <div
      className="platform-banner rounded-2xl p-8 md:p-10 hover:scale-[1.01] transition-all duration-500 group"
      style={{
        background: 'linear-gradient(135deg, rgba(14, 13, 28, 0.6), rgba(7, 7, 18, 0.8))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-3xl font-bold flex items-center gap-3"
          style={{
            background: "linear-gradient(to right, #60a5fa, #c084fc, #f43f5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Codeforces
        </h2>
        {!loading && data?.maxRating && (
          <div
            className="text-xs px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${maxRatingInfo.color}22`,
              color: maxRatingInfo.color,
              border: `1px solid ${maxRatingInfo.color}55`,
            }}
          >
            {maxRatingInfo.title}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : data ? (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Avatar + Username */}
            <div className="flex items-center gap-4">
              <a
                href={data.profile}
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <img
                  src={data.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover transition-all duration-300"
                  style={{
                    border: `2px solid ${currentRatingInfo.color}`,
                    boxShadow: `0 0 16px ${currentRatingInfo.color}40`,
                  }}
                />
              </a>
              <div>
                <a
                  href={data.profile}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center group"
                >
                  <h3
                    className="text-xl font-bold transition-all duration-300"
                    style={{ color: currentRatingInfo.color }}
                  >
                    {data.username}{" "}
                    <span className="text-sm ml-1.5 opacity-60 group-hover:opacity-100">
                      ↗
                    </span>
                  </h3>
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-xl flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <FaStar style={{ color: currentRatingInfo.color }} />
                <span className="text-xs text-gray-400">Current</span>
                <span className="font-bold text-white text-sm">{data.rating}</span>
              </div>
              <div
                className="px-4 py-2 rounded-xl flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <FaChartLine style={{ color: maxRatingInfo.color }} />
                <span className="text-xs text-gray-400">Max</span>
                <span className="font-bold text-white text-sm">{data.maxRating}</span>
              </div>
            </div>
          </div>

          {/* Graph */}
          {data.ratingHistory && data.ratingHistory.length > 0 && (
            <div
              className="mt-4 p-5 rounded-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Rating Progress</div>
              <CodeforcesGraph data={data.ratingHistory} />
            </div>
          )}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <p className="text-gray-400 text-sm">No Codeforces data available</p>
        </div>
      )}
    </div>
  );
};

export default CodeforcesCard;
