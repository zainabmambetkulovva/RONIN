'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Activity, DollarSign } from 'lucide-react'
import { Card, StatCard } from '@/app/components/common'
import { ComputerMap, RoninInsights } from '@/app/components/admin'
import { mockComputers, mockPayments, mockBookings, mockGameSessions } from '@/lib/data/mock-data'

export default function AdminDashboardPage() {
  const [computers, setComputers] = useState(mockComputers)
  const [sessions, setSessions] = useState(mockGameSessions)

  // Simulate some status changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setComputers((prev) =>
        prev.map((pc) => ({
          ...pc,
          status: Math.random() > 0.7 ? 
            (prev.indexOf(pc) % 3 === 0 ? 'available' : prev.indexOf(pc) % 3 === 1 ? 'busy' : 'reserved')
            : pc.status,
        }))
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0)
  const activeBookings = mockBookings.filter((b) => b.booking_status === 'active').length
  const totalUsers = new Set(mockBookings.map((b) => b.customer_name)).size

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Active Bookings',
      value: activeBookings,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Active Computers',
      value: computers.filter((c) => c.status !== 'maintenance').length,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">System overview and real-time monitoring</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Computer Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="border-cyan-500/30">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Club Layout</h2>
            <p className="text-sm text-slate-400">
              Real-time computer status and availability
            </p>
          </div>
          <ComputerMap computers={computers} />
        </Card>
      </motion.div>

      {/* RONIN Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RoninInsights />
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Recent Activity */}
        <Card className="border-blue-500/30">
          <h3 className="text-lg font-bold text-white mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {mockBookings.slice(-5).map((booking, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {booking.customer_name}
                  </p>
                  <p className="text-xs text-slate-400">
                    PC: {booking.computer_number}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    booking.booking_status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {booking.booking_status}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* System Status */}
        <Card className="border-purple-500/30">
          <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Server', status: 'online', color: 'green' },
              { label: 'Database', status: 'online', color: 'green' },
              { label: 'Payment Gateway', status: 'online', color: 'green' },
              { label: 'Backup', status: 'running', color: 'blue' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between"
              >
                <p className="text-sm text-slate-300">{item.label}</p>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`px-3 py-1 rounded-full text-xs font-bold bg-${item.color}-500/20 text-${item.color}-400`}
                >
                  {item.status}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
