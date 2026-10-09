"use client";

import { Users, Shield, Calendar, Monitor, Tag, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: "users" | "shield" | "calendar" | "monitor" | "tag";
  color: string;
}

const icons = {
  users: Users,
  shield: Shield,
  calendar: Calendar,
  monitor: Monitor,
  tag: Tag,
};

export function StatCard({ label, value, subtitle, icon, color }: StatCardProps) {
  const Icon = icons[icon];

  return (
    <div
      className="rounded-xl p-4 transition-all hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: `1px solid ${color}40`,
      }}
    >
      {/* Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}20`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </div>
      </div>

      {/* Value */}
      <div className="text-3xl font-black text-white mb-1">
        {value}
      </div>

      {/* Subtitle */}
      <div className="text-xs text-gray-500">
        {subtitle}
      </div>
    </div>
  );
}
