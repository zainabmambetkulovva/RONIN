'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Zap, Award } from 'lucide-react'

interface Insight {
  icon: React.ReactNode
  title: string
  description: string
  metric: string
  status: 'good' | 'warning' | 'alert'
}

export function RoninInsights() {
  const insights: Insight[] = [
    {
      icon: <TrendingUp size={20} />,
      title: 'Revenue Trend',
      description:
        'Daily revenue is up 23% compared to last week. Peak hours are 14:00-18:00.',
      metric: '+23%',
      status: 'good',
    },
    {
      icon: <Award size={20} />,
      title: 'Top Performer',
      description:
        'PC-02 generated $2,450 revenue this week. Consider upgrading similar configs.',
      metric: '$2,450',
      status: 'good',
    },
    {
      icon: <Zap size={20} />,
      title: 'Occupancy Rate',
      description:
        'Current occupancy is 87%. Recommend opening extra stations during peak hours.',
      metric: '87%',
      status: 'warning',
    },
    {
      icon: <AlertCircle size={20} />,
      title: 'Maintenance Alert',
      description:
        'PC-10 has been offline for 2 hours. Check status to prevent revenue loss.',
      metric: '2 hrs',
      status: 'alert',
    },
  ]

  const getColorClasses = (status: string) => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'text-green-400',
          badge: 'bg-green-500/20 text-green-400',
        }
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          icon: 'text-orange-400',
          badge: 'bg-orange-500/20 text-orange-400',
        }
      case 'alert':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          badge: 'bg-red-500/20 text-red-400',
        }
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          icon: 'text-slate-400',
          badge: 'bg-slate-500/20 text-slate-400',
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          RONIN Insights
        </h2>
        <p className="text-slate-400 text-sm">
          AI-powered business intelligence and recommendations
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const colors = getColorClasses(insight.status)
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-lg border ${colors.bg} ${colors.border} backdrop-blur-sm transition-all`}
            >
              {/* Icon and Title */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${colors.badge}`}>
                  {insight.icon}
                </div>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`text-lg font-black ${colors.icon}`}
                >
                  {insight.metric}
                </motion.span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">
                {insight.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {insight.description}
              </p>

              {/* Action */}
              <motion.button
                whileHover={{ x: 4 }}
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                Learn more →
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Smart Recommendation
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              Based on current trends, consider implementing a dynamic pricing model for peak
              hours (14:00-18:00). This could increase revenue by an estimated 15-20% while
              maintaining high occupancy rates.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
              <Zap size={14} />
              Estimated Impact: +$750/week
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
