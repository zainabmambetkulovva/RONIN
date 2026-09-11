'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Globe, Zap } from 'lucide-react'
import { Card, Button } from '@/app/components/common'

export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure system-wide settings and preferences</p>
      </motion.div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">General Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                System Name
              </label>
              <input
                type="text"
                value="RONIN Computer Club"
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-red-500/50">
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

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={20} className="text-red-400" />
            Notifications
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Payment Alerts', enabled: true },
              { label: 'System Maintenance Alerts', enabled: true },
              { label: 'Daily Reports', enabled: false },
              { label: 'User Registration Alerts', enabled: true },
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
                  className="w-5 h-5 accent-red-400"
                />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={20} className="text-red-400" />
            Security
          </h3>

          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Change Admin Password
            </Button>
            <Button variant="ghost" className="w-full">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="ghost" className="w-full">
              View Security Logs
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* System Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-red-400" />
            System Performance
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Database Size</p>
              <div className="flex items-center justify-between">
                <div className="flex-1 h-2 bg-slate-700 rounded-full mr-4">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '35%' }} />
                </div>
                <p className="text-white font-mono text-sm">3.5 GB / 10 GB</p>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">API Response Time</p>
              <p className="text-white font-mono">
                Avg: <span className="text-green-400 font-bold">45ms</span>
              </p>
            </div>

            <Button variant="outline" className="w-full">
              View System Logs
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
