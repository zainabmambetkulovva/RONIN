'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Globe } from 'lucide-react'
import { Card, Button } from '@/app/components/common'

export default function ManagerSettingsPage() {
  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Manager Settings</h1>
        <p className="text-slate-400">Configure your manager account and preferences</p>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Manager Name
              </label>
              <input
                type="text"
                value="Manager Account"
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value="manager@ronin.club"
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
              />
            </div>

            <Button variant="outline" className="w-full">
              Update Account
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={20} className="text-cyan-400" />
            Notifications
          </h3>

          <div className="space-y-3">
            {[
              { label: 'New Bookings', enabled: true },
              { label: 'Payment Alerts', enabled: true },
              { label: 'Session End Warnings', enabled: true },
              { label: 'System Alerts', enabled: false },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <p className="text-white font-medium">{item.label}</p>
                <input
                  type="checkbox"
                  defaultChecked={item.enabled}
                  className="w-5 h-5 accent-purple-400"
                />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Regional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe size={20} className="text-cyan-400" />
            Regional Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50">
                <option>English</option>
                <option>Русский</option>
                <option>Қазақ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50">
                <option>KGS (Kyrgyzstan)</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>

            <Button variant="outline" className="w-full">
              Save Settings
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={20} className="text-cyan-400" />
            Security
          </h3>

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="ghost" className="w-full">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="ghost" className="w-full">
              View Login Activity
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
