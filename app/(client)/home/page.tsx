'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Zap, Users } from 'lucide-react'
import { Card } from '@/app/components/common'

export default function ClientHomePage() {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      label: 'Available PCs',
      value: '24',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Active Sessions',
      value: '6',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Current Time',
      value: currentTime || '--:--:--',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to RONIN
          </span>
        </h1>
        <p className="text-xl text-slate-400">
          Premium Gaming Club Portal — Book, Play, Enjoy
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <Card className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border-slate-700/50`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="text-slate-300" size={24} />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="border-cyan-500/30">
          <h3 className="text-lg font-bold text-white mb-3">🎮 Browse Computers</h3>
          <p className="text-slate-300 text-sm mb-4">
            Explore our collection of high-performance gaming PCs with real-time availability.
          </p>
          <p className="text-xs text-slate-400">
            Check specs, current status, and book your slot instantly.
          </p>
        </Card>

        <Card className="border-purple-500/30">
          <h3 className="text-lg font-bold text-white mb-3">⚡ Flexible Pricing</h3>
          <p className="text-slate-300 text-sm mb-4">
            Choose from multiple gaming tariffs based on your needs.
          </p>
          <p className="text-xs text-slate-400">
            Hourly, daily, or premium passes — all with transparent pricing.
          </p>
        </Card>

        <Card className="border-green-500/30">
          <h3 className="text-lg font-bold text-white mb-3">📅 Easy Booking</h3>
          <p className="text-slate-300 text-sm mb-4">
            Reserve your gaming rig in advance with our intuitive booking system.
          </p>
          <p className="text-xs text-slate-400">
            Secure your spot and get instant confirmation with receipt.
          </p>
        </Card>

        <Card className="border-pink-500/30">
          <h3 className="text-lg font-bold text-white mb-3">🎯 AI Assistant</h3>
          <p className="text-slate-300 text-sm mb-4">
            Get personalized recommendations from our AI chat.
          </p>
          <p className="text-xs text-slate-400">
            Ask anything about availability, pricing, or gaming setups.
          </p>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Play?</h3>
            <p className="text-slate-300 mb-4">
              Browse available computers, choose your tariff, and start gaming today.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/client/computers"
                className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition"
              >
                Browse PCs →
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/client/booking"
                className="px-6 py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
              >
                Book Now →
              </motion.a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
