'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Power } from 'lucide-react'
import { Card, Button } from '@/app/components/common'
import { mockComputers } from '@/lib/data/mock-data'

export default function AdminComputersPage() {
  const [computers] = useState(mockComputers)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Computers</h1>
          <p className="text-slate-400">Manage system computers and maintenance</p>
        </div>
        <Button variant="primary" glow className="flex items-center gap-2">
          <Plus size={18} />
          Add Computer
        </Button>
      </motion.div>

      {/* Computers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {computers.slice(0, 9).map((pc, index) => (
          <motion.div
            key={pc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-white">{pc.name}</p>
                  <p className="text-sm text-cyan-400 font-mono">{pc.number}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                    pc.status === 'available'
                      ? 'bg-green-500/20 text-green-400'
                      : pc.status === 'busy'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {pc.status}
                </span>
              </div>

              <div className="text-xs space-y-1 mb-4 text-slate-400">
                <p>CPU: {pc.specs.cpu}</p>
                <p>GPU: {pc.specs.gpu}</p>
                <p>RAM: {pc.specs.ram}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Power size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
