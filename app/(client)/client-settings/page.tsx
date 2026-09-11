'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Globe, Eye, EyeOff } from 'lucide-react'
import { Card, Button, useToast } from '@/app/components/common'

export default function SettingsPage() {
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const toggleSettings = [
    {
      title: 'Email Notifications',
      description: 'Receive email updates on bookings and payments',
      enabled: true,
    },
    {
      title: 'SMS Notifications',
      description: 'Get text alerts for important updates',
      enabled: false,
    },
    {
      title: 'Marketing Emails',
      description: 'Receive special offers and promotions',
      enabled: true,
    },
    {
      title: 'Dark Mode',
      description: 'Use dark theme (enabled by default)',
      enabled: true,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and security</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value="Demo User"
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value="user@ronin.club"
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value="+996 555 123-456"
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <Button variant="outline" className="w-full">
              Update Profile
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={20} className="text-cyan-400" />
            Security
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              glow
              onClick={() => showToast('Password changed successfully!', 'success', 3000)}
            >
              Change Password
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={20} className="text-cyan-400" />
            Notifications
          </h3>

          <div className="space-y-4">
            {toggleSettings.map((setting, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-white">{setting.title}</p>
                  <p className="text-sm text-slate-400">{setting.description}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={setting.enabled}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Language Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe size={20} className="text-cyan-400" />
            Language & Region
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50">
                <option>English</option>
                <option>Русский</option>
                <option>Қазақ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time Zone
              </label>
              <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50">
                <option>UTC+6 (Kyrgyzstan)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+3 (Moscow)</option>
              </select>
            </div>

            <Button variant="outline" className="w-full">
              Save Preferences
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-red-500/30">
          <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>

          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              These actions cannot be undone. Please be careful.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1">
                Deactivate Account
              </Button>
              <Button variant="ghost" className="flex-1">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
