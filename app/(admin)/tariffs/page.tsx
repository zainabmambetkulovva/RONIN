'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Toggle2 } from 'lucide-react'
import { Card, Button } from '@/app/components/common'
import { mockTariffs } from '@/lib/data/mock-data'

export default function AdminTariffsPage() {
  const [tariffs] = useState(mockTariffs)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tariffs</h1>
          <p className="text-slate-400">Manage pricing and service packages</p>
        </div>
        <Button variant="primary" glow className="flex items-center gap-2">
          <Plus size={18} />
          Add Tariff
        </Button>
      </motion.div>

      {/* Tariffs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Name</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Type</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Duration</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Price</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Status</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((tariff, index) => (
                  <motion.tr
                    key={tariff.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-white">{tariff.name}</p>
                        <p className="text-xs text-slate-400">{tariff.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-slate-300 capitalize">
                        {tariff.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-white">
                      {tariff.duration_minutes} min
                    </td>
                    <td className="py-4 px-4 text-center text-cyan-400 font-bold">
                      ${tariff.price}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          tariff.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {tariff.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button variant="ghost" size="sm">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Toggle2 size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
