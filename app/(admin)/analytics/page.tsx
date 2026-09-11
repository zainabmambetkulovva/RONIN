'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar } from 'lucide-react'
import { Card, Button } from '@/app/components/common'

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">System performance and business metrics</p>
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 items-center"
      >
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar size={18} />
          Last 30 Days
        </Button>
        <div className="flex-1" />
        <Button variant="primary" glow>
          Export Report
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Revenue', value: '$45,320', trend: '+23%', color: 'from-green-500 to-emerald-500' },
          { label: 'Avg Daily Revenue', value: '$1,511', trend: '+12%', color: 'from-cyan-500 to-blue-500' },
          { label: 'Bookings/Day', value: '23', trend: '+8%', color: 'from-purple-500 to-pink-500' },
          { label: 'Customer Retention', value: '92%', trend: '+5%', color: 'from-orange-500 to-yellow-500' },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`bg-gradient-to-br ${metric.color} bg-opacity-10 border border-slate-700/50 rounded-lg p-6`}
          >
            <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
            <p className="text-xs text-green-400 font-medium">{metric.trend}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Revenue Trend</h3>
            <TrendingUp className="text-green-400" size={24} />
          </div>
          <div className="h-64 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/50">
            <p className="text-slate-500">Chart placeholder</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Computer Utilization</h3>
            <TrendingUp className="text-cyan-400" size={24} />
          </div>
          <div className="h-64 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/50">
            <p className="text-slate-500">Chart placeholder</p>
          </div>
        </Card>
      </motion.div>

      {/* Top Performing Computers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Top Performing Computers</h3>
          <div className="space-y-3">
            {[
              { computer: 'PC-02', revenue: '$2,450', bookings: 32, utilization: '95%' },
              { computer: 'PC-07', revenue: '$2,180', bookings: 28, utilization: '88%' },
              { computer: 'PC-04', revenue: '$1,920', bookings: 24, utilization: '82%' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white text-sm">{item.computer}</p>
                </div>
                <div className="flex gap-8 text-sm">
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Revenue</p>
                    <p className="font-bold text-cyan-400">{item.revenue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Bookings</p>
                    <p className="font-bold text-white">{item.bookings}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Utilization</p>
                    <p className="font-bold text-green-400">{item.utilization}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
