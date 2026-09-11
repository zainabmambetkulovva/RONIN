'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gamepad2, Users, Shield } from 'lucide-react'

export default function Home() {
  const roles = [
    {
      title: 'Клиент',
      href: '/client/home',
      icon: Gamepad2,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Менеджер',
      href: '/manager/dashboard',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Админ',
      href: '/admin/admin-dashboard',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-8xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              RONIN
            </span>
          </h1>
        </motion.div>

        {/* Role Buttons */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-8 justify-center items-center max-w-4xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={role.href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex-1 min-w-[160px]"
              >
                <Link href={role.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-4">
                      {/* Icon */}
                      <motion.div
                        className={`p-6 rounded-2xl bg-gradient-to-r ${role.color} shadow-lg`}
                        whileHover={{ rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-12 h-12 text-white" />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-2xl font-black text-white text-center group-hover:text-cyan-400 transition-colors">
                        {role.title}
                      </h3>

                      {/* Arrow */}
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-cyan-400 text-xl"
                      >
                        ↓
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
