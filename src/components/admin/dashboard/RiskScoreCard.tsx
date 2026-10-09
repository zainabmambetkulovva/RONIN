"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface RiskScoreCardProps {
  score: number;
  status: string;
  bookings: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

export function RiskScoreCard({ score, status, bookings }: RiskScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const percentage = (score / 1000) * 100;
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="rounded-xl p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          System Score
        </h3>
        <button className="text-gray-500 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(139,92,246,0.1)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-black text-white mb-1">
              {animatedScore}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8b5cf6" }}>
              {status}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-t border-gray-800">
          <span className="text-sm text-gray-400">Активных</span>
          <span className="text-sm font-bold text-white">{bookings.active}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-800">
          <span className="text-sm text-gray-400">Завершено</span>
          <span className="text-sm font-bold text-green-400">{bookings.completed}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-800">
          <span className="text-sm text-gray-400">Отменено</span>
          <span className="text-sm font-bold text-red-400">{bookings.cancelled}</span>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
