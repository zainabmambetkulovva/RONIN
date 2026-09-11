'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, X, Clock, Zap, DollarSign } from 'lucide-react'
import { Card, Button, useToast } from '@/app/components/common'

interface Session {
  id: number
  computer: string
  customer: string
  status: 'running' | 'paused'
  duration: number
  startTime: Date
  hourlyRate: number
  totalCost: number
}

export default function SessionsPage() {
  const { showToast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      computer: 'PC-02',
      customer: 'Ahmed Khan',
      status: 'running',
      duration: 45 * 60 + 32, // seconds
      startTime: new Date(Date.now() - 45 * 60 * 1000 - 32 * 1000),
      hourlyRate: 200,
      totalCost: 150,
    },
    {
      id: 2,
      computer: 'PC-07',
      customer: 'Maria Suleimanova',
      status: 'running',
      duration: 128 * 60 + 45,
      startTime: new Date(Date.now() - 128 * 60 * 1000 - 45 * 1000),
      hourlyRate: 100,
      totalCost: 214,
    },
    {
      id: 3,
      computer: 'PC-12',
      customer: 'John Doe',
      status: 'paused',
      duration: 60 * 60,
      startTime: new Date(Date.now() - 60 * 60 * 1000),
      hourlyRate: 50,
      totalCost: 50,
    },
  ])

  // Update session durations every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) =>
        prev.map((session) => ({
          ...session,
          duration: session.status === 'running' ? session.duration + 1 : session.duration,
          totalCost:
            session.status === 'running'
              ? (session.duration / 3600) * session.hourlyRate
              : session.totalCost,
        }))
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePauseResume = (id: number) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'running' ? 'paused' : 'running',
            }
          : s
      )
    )
    const session = sessions.find((s) => s.id === id)
    const newStatus = session?.status === 'running' ? 'paused' : 'running'
    showToast(
      `${session?.computer} session ${newStatus}`,
      newStatus === 'paused' ? 'warning' : 'info',
      2000
    )
  }

  const handleEndSession = (id: number) => {
    const session = sessions.find((s) => s.id === id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
    showToast(
      `Session ended. Total: $${session?.totalCost.toFixed(2)}`,
      'success',
      3000
    )
  }

  const totalRevenue = sessions.reduce((sum, s) => sum + s.totalCost, 0)
  const activeSessions = sessions.filter((s) => s.status === 'running').length

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Active Sessions</h1>
        <p className="text-slate-400">Monitor and manage active gaming sessions</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            label: 'Active Sessions',
            value: activeSessions,
            icon: Zap,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Total Sessions',
            value: sessions.length,
            icon: Clock,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Current Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'from-purple-500 to-pink-500',
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-slate-700/50 rounded-lg p-6`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="text-slate-300" size={24} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Sessions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card
              className={
                session.status === 'running'
                  ? 'border-green-500/30 shadow-lg shadow-green-500/10'
                  : 'border-yellow-500/30 shadow-lg shadow-yellow-500/10'
              }
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-white">{session.computer}</p>
                  <p className="text-sm text-slate-400">{session.customer}</p>
                </div>
                <motion.span
                  animate={{
                    scale: session.status === 'running' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: session.status === 'running' ? Infinity : 0,
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    session.status === 'running'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {session.status === 'running' ? 'Running' : 'Paused'}
                </motion.span>
              </div>

              {/* Duration Display */}
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                  Session Duration
                </p>
                <motion.p
                  key={formatTime(session.duration)} // Force re-render
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="text-4xl font-mono font-black text-cyan-400"
                >
                  {formatTime(session.duration)}
                </motion.p>
              </div>

              {/* Cost Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-700/50 rounded">
                  <p className="text-xs text-slate-400 mb-1">Hourly Rate</p>
                  <p className="text-lg font-bold text-white">
                    ${session.hourlyRate}
                  </p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <p className="text-xs text-slate-400 mb-1">Current Cost</p>
                  <p className="text-lg font-bold text-cyan-400">
                    ${session.totalCost.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handlePauseResume(session.id)}
                >
                  {session.status === 'running' ? (
                    <>
                      <Pause size={16} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Resume
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                  onClick={() => handleEndSession(session.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Card */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">
                  Today's Performance
                </p>
                <p className="text-2xl font-bold text-white">
                  ${totalRevenue.toFixed(2)} from {sessions.length} active session
                  {sessions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="text-4xl"
              >
                💰
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <p className="text-lg text-slate-400 mb-2">No active sessions</p>
          <p className="text-sm text-slate-500">All computers are available</p>
        </motion.div>
      )}
    </div>
  )
}
