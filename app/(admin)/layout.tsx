'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Gamepad2,
  DollarSign,
  Users,
  Tag,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Shield,
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/admin/admin-dashboard', icon: LayoutDashboard },
  { label: 'Computers', href: '/admin/admin-computers', icon: Gamepad2 },
  { label: 'Tariffs', href: '/admin/tariffs', icon: Tag },
  { label: 'Payments', href: '/admin/payments', icon: DollarSign },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/admin-settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden md:flex w-64 flex-col border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <Link href="/admin/admin-dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                RONIN
              </div>
              <p className="text-xs text-slate-400 uppercase font-bold">Admin</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="text-sm text-slate-400">
            Admin Panel • {new Date().toLocaleDateString()}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-orange-400" />
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm"
          >
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
