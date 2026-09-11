'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  change?: number
  changeType?: 'increase' | 'decrease'
  glow?: boolean
  animated?: boolean
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeType = 'increase',
  glow = true,
  animated = true,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0)

  useEffect(() => {
    if (!animated || typeof value === 'string') {
      setDisplayValue(value)
      return
    }

    const target = value as number
    const duration = 1000
    const start = Date.now()

    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setDisplayValue(Math.floor(target * progress))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(target)
      }
    }

    animate()
  }, [value, animated])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`
        bg-gradient-to-br from-slate-800/50 to-slate-900/50
        border border-slate-700/50 rounded-lg p-6
        backdrop-blur-sm transition-all duration-300
        ${glow ? 'shadow-lg shadow-cyan-500/20' : ''}
        hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/30
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        {icon && (
          <div className="text-cyan-400 opacity-60">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-white"
        >
          {displayValue}
        </motion.p>

        {change !== undefined && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xs font-medium ${
              changeType === 'increase' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {changeType === 'increase' ? '↑' : '↓'} {Math.abs(change)}%
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
