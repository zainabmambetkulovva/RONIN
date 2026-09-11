'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Edit, Trash2, Ban } from 'lucide-react'
import { Card, Button } from '@/app/components/common'

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+996 555 123-456', status: 'active', bookings: 5 },
    { id: 2, name: 'Maria Suleimanova', email: 'maria@example.com', phone: '+996 777 987-654', status: 'active', bookings: 12 },
    { id: 3, name: 'John Doe', email: 'john@example.com', phone: '+996 555 654-321', status: 'active', bookings: 3 },
    { id: 4, name: 'Test User', email: 'test@example.com', phone: '+996 555 111-222', status: 'inactive', bookings: 0 },
  ]

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
        <p className="text-slate-400">Manage customer accounts and permissions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
          >
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">ID: #{user.id}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    user.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={14} className="text-slate-400" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={14} className="text-slate-400" />
                  {user.phone}
                </div>
              </div>

              <div className="mb-4 p-3 bg-slate-800/50 rounded">
                <p className="text-xs text-slate-400">Total Bookings</p>
                <p className="text-lg font-bold text-white">{user.bookings}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Ban size={14} />
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
