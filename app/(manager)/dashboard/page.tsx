'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Zap,
  ReceiptText,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
} from 'lucide-react'
import { StatCard, Card, Badge } from '@/app/components/common'
import { mockDashboardStats, mockBookings, mockReceipts } from '@/lib/data/mock-data'

export default function ManagerDashboard() {
  const stats = [
    {
      title: 'Today Revenue',
      value: mockDashboardStats.today_revenue,
      icon: <DollarSign size={24} />,
      change: 12,
      changeType: 'increase' as const,
    },
    {
      title: 'Today Bookings',
      value: mockDashboardStats.today_bookings,
      icon: <ShoppingCart size={24} />,
      change: 5,
      changeType: 'increase' as const,
    },
    {
      title: 'Active Sessions',
      value: mockDashboardStats.active_sessions,
      icon: <Zap size={24} />,
      change: 2,
      changeType: 'decrease' as const,
    },
    {
      title: 'Total Users',
      value: mockDashboardStats.total_users,
      icon: <Users size={24} />,
      change: 8,
      changeType: 'increase' as const,
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your daily overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              changeType={stat.changeType}
              glow
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white">Recent Orders</h3>
              <span className="ml-auto px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
                {mockBookings.length}
              </span>
            </div>

            <div className="space-y-3">
              {mockBookings.slice(0, 4).map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{booking.booking_number}</p>
                      <p className="text-xs text-slate-400">{booking.customer_name}</p>
                    </div>
                    <Badge variant="primary">{booking.booking_status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{booking.computer_number}</span>
                    <span className="font-bold text-purple-400">${booking.total_price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Active Sessions Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-green-400" size={24} />
              <h3 className="text-xl font-bold text-white">Active Now</h3>
            </div>

            <div className="space-y-3">
              {[
                { pc: 'PC-02', user: 'Ahmed', time: '45m' },
                { pc: 'PC-07', user: 'Maria', time: '128m' },
                { pc: 'PC-12', user: 'John', time: '60m' },
              ].map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{session.pc}</p>
                      <p className="text-xs text-slate-400">{session.user}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-mono">{session.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Receipt Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <ReceiptText className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold text-white">Receipt Board</h3>
            <span className="ml-auto px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
              {mockReceipts.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockReceipts.map((receipt, index) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="p-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-lg hover:border-blue-500/50 transition-all"
              >
                {/* Receipt Code */}
                <div className="mb-3">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                    Receipt Code
                  </p>
                  <p className="text-2xl font-mono font-black text-blue-400">
                    {receipt.receipt_code}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Computer:</span>
                    <span className="text-white font-medium">{receipt.computer_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Customer:</span>
                    <span className="text-white font-medium text-xs">
                      {receipt.customer_name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-blue-400 font-bold">${receipt.price}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      receipt.status === 'active'
                        ? 'bg-green-400 animate-pulse'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-xs text-slate-300 uppercase tracking-wide">
                    {receipt.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            label: 'Avg Session Duration',
            value: '2h 34m',
            icon: Clock,
          },
          {
            label: 'Occupancy Rate',
            value: '87%',
            icon: TrendingUp,
          },
          {
            label: 'Customer Satisfaction',
            value: '4.8/5',
            icon: Users,
          },
        ].map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 text-center"
            >
              <Icon className="mx-auto text-purple-400 mb-3" size={24} />
              <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
