'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter, Zap, Wifi } from 'lucide-react'
import { Card, Badge, Button } from '@/app/components/common'
import { mockComputers } from '@/lib/data/mock-data'

type CategoryFilter = 'all' | 'premium' | 'standard' | 'budget'
type StatusFilter = 'all' | 'available' | 'busy' | 'reserved' | 'maintenance'

const statusColors = {
  available: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    label: 'Available',
  },
  busy: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    label: 'Busy',
  },
  reserved: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    label: 'Reserved',
  },
  maintenance: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    label: 'Maintenance',
  },
}

export default function ComputersPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredComputers = useMemo(() => {
    return mockComputers.filter((pc) => {
      const categoryMatch = categoryFilter === 'all' || pc.category === categoryFilter
      const statusMatch = statusFilter === 'all' || pc.status === statusFilter
      return categoryMatch && statusMatch
    })
  }, [categoryFilter, statusFilter])

  const stats = {
    total: mockComputers.length,
    available: mockComputers.filter((c) => c.status === 'available').length,
    busy: mockComputers.filter((c) => c.status === 'busy').length,
    reserved: mockComputers.filter((c) => c.status === 'reserved').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-2 text-white">Available Computers</h1>
        <p className="text-slate-400">Browse and book your perfect gaming setup</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total PCs', value: stats.total, color: 'from-cyan-500 to-blue-500' },
          { label: 'Available', value: stats.available, color: 'from-green-500 to-emerald-500' },
          { label: 'Busy', value: stats.busy, color: 'from-orange-500 to-yellow-500' },
          { label: 'Reserved', value: stats.reserved, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm`}
          >
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-sm"
      >
        <div className="flex items-center gap-4 mb-6">
          <Filter size={20} className="text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Category</p>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'premium', 'standard', 'budget'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                      : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'available', 'busy', 'reserved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                      : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Computers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredComputers.map((pc, index) => {
          const statusInfo = statusColors[pc.status]
          const categoryLabel = pc.category.charAt(0).toUpperCase() + pc.category.slice(1)

          return (
            <motion.div
              key={pc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className={`h-full flex flex-col justify-between ${
                  pc.status === 'available'
                    ? 'border-green-500/30 shadow-lg shadow-green-500/10'
                    : 'opacity-75'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{pc.name}</h3>
                      <p className="text-sm text-cyan-400 font-mono">{pc.number}</p>
                    </div>
                    <Badge variant="primary">{categoryLabel}</Badge>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-block mb-4 px-3 py-1 rounded-full ${statusInfo.bg} border ${statusInfo.border}`}>
                    <div className="flex items-center gap-2">
                      <Wifi size={12} className={statusInfo.text} />
                      <span className={`text-sm font-medium ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="space-y-2 mb-6">
                    <div className="text-sm">
                      <p className="text-slate-400">CPU: <span className="text-cyan-200">{pc.specs.cpu}</span></p>
                      <p className="text-slate-400">GPU: <span className="text-cyan-200">{pc.specs.gpu}</span></p>
                      <p className="text-slate-400">RAM: <span className="text-cyan-200">{pc.specs.ram}</span></p>
                      <p className="text-slate-400">Monitor: <span className="text-cyan-200">{pc.specs.monitor}</span></p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-cyan-400">
                      ${pc.price_per_hour}
                      <span className="text-sm text-slate-400 font-normal"> /hour</span>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                {pc.status !== 'available' && pc.booking_until && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded text-xs text-slate-300">
                    <p>
                      Available again:{' '}
                      <span className="text-cyan-400 font-mono">
                        {new Date(pc.booking_until).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex gap-2">
                  {pc.status === 'available' ? (
                    <Button variant="primary" className="flex-1" glow>
                      Book Now
                    </Button>
                  ) : (
                    <Button variant="ghost" className="flex-1" disabled>
                      {pc.status === 'maintenance' ? 'Maintenance' : 'Unavailable'}
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Empty State */}
      {filteredComputers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="text-center">
            <Zap className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-lg text-slate-400 mb-2">No computers found</p>
            <p className="text-sm text-slate-500">
              Try adjusting your filters to find available systems
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
