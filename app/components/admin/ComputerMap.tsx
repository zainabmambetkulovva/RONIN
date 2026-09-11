'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Zap } from 'lucide-react'
import { mockComputers } from '@/lib/data/mock-data'

type ComputerStatus = 'available' | 'busy' | 'reserved' | 'maintenance'

export function ComputerMap() {
  const [computers, setComputers] = useState(mockComputers)
  const [selectedPc, setSelectedPc] = useState<string | null>(null)

  // Simulate status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setComputers((prev) =>
        prev.map((pc) => {
          // Random status changes for demo
          if (Math.random() > 0.85) {
            const statuses: ComputerStatus[] = ['available', 'busy', 'reserved']
            const randomStatus =
              statuses[Math.floor(Math.random() * statuses.length)]
            return {
              ...pc,
              status: randomStatus,
              booking_until:
                randomStatus !== 'available'
                  ? new Date(Date.now() + Math.random() * 5 * 60 * 60 * 1000)
                  : undefined,
            }
          }
          return pc
        })
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ComputerStatus) => {
    switch (status) {
      case 'available':
        return 'from-green-500 to-emerald-500'
      case 'busy':
        return 'from-red-500 to-orange-500'
      case 'reserved':
        return 'from-blue-500 to-cyan-500'
      case 'maintenance':
        return 'from-slate-500 to-gray-500'
      default:
        return 'from-slate-500 to-slate-600'
    }
  }

  const getStatusBgClass = (status: ComputerStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 border-green-500/50'
      case 'busy':
        return 'bg-red-500/20 border-red-500/50'
      case 'reserved':
        return 'bg-blue-500/20 border-blue-500/50'
      case 'maintenance':
        return 'bg-slate-500/20 border-slate-500/50'
      default:
        return 'bg-slate-500/20 border-slate-500/50'
    }
  }

  const getStatusLabel = (status: ComputerStatus) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'busy':
        return 'Busy'
      case 'reserved':
        return 'Reserved'
      case 'maintenance':
        return 'Maintenance'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Computer Club Map</h2>
        <p className="text-slate-400 text-sm">Real-time status of all computers</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        {[
          { status: 'available', label: 'Available' },
          { status: 'busy', label: 'In Use' },
          { status: 'reserved', label: 'Reserved' },
          { status: 'maintenance', label: 'Maintenance' },
        ].map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(item.status as ComputerStatus)}`}
            />
            <span className="text-sm text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Computer Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {computers.map((pc, index) => (
          <motion.div
            key={pc.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            <motion.button
              onClick={() => setSelectedPc(selectedPc === pc.id ? null : pc.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <motion.div
                animate={{
                  borderColor:
                    pc.status === 'busy'
                      ? ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.3)']
                      : undefined,
                }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className={`p-3 rounded-lg border-2 transition-all duration-500 cursor-pointer ${getStatusBgClass(pc.status)}`}
              >
                {/* Status Indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase">
                    {pc.number}
                  </span>
                  <motion.div
                    animate={{
                      scale: pc.status === 'busy' ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: pc.status === 'busy' ? Infinity : 0,
                    }}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(pc.status)}`}
                  />
                </div>

                {/* Status Label */}
                <p className="text-xs text-slate-300 mb-2">
                  {getStatusLabel(pc.status)}
                </p>

                {/* Category Badge */}
                <div className="flex items-center gap-1 mb-2">
                  <div
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      pc.category === 'premium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : pc.category === 'standard'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-500/20 text-slate-300'
                    }`}
                  >
                    {pc.category}
                  </div>
                </div>

                {/* Price */}
                <p className="text-xs font-bold text-white">
                  ${pc.price_per_hour}
                  <span className="text-xs text-slate-400">/h</span>
                </p>
              </motion.div>
            </motion.button>

            {/* Selected Details */}
            {selectedPc === pc.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-2 left-0 right-0 z-20 p-3 bg-slate-900/95 border border-cyan-500/50 rounded-lg text-left text-xs space-y-1 backdrop-blur-sm"
              >
                <p className="font-bold text-white">{pc.name}</p>
                <p className="text-slate-300">{pc.specs.cpu}</p>
                <p className="text-slate-300">{pc.specs.gpu}</p>
                <p className="text-slate-300">{pc.specs.ram}</p>
                {pc.booking_until && (
                  <p className="text-orange-400 text-xs">
                    Free at:{' '}
                    {pc.booking_until.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        {[
          {
            label: 'Available',
            count: computers.filter((c) => c.status === 'available').length,
            color: 'text-green-400',
          },
          {
            label: 'In Use',
            count: computers.filter((c) => c.status === 'busy').length,
            color: 'text-red-400',
          },
          {
            label: 'Reserved',
            count: computers.filter((c) => c.status === 'reserved').length,
            color: 'text-blue-400',
          },
          {
            label: 'Maintenance',
            count: computers.filter((c) => c.status === 'maintenance').length,
            color: 'text-slate-400',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-black mb-1">
              <span className={stat.color}>{stat.count}</span>
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
