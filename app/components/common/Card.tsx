'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
  animated?: boolean
}

export function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  animated = true,
}: CardProps) {
  const baseStyles = `
    bg-slate-900/50 border border-slate-700/50 rounded-lg p-6
    backdrop-blur-sm transition-all duration-300
    ${glow ? 'shadow-lg shadow-cyan-500/20' : ''}
    ${hover ? 'cursor-pointer hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/30' : ''}
    ${className}
  `

  if (!animated) {
    return (
      <div onClick={onClick} className={baseStyles}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      className={baseStyles}
    >
      {children}
    </motion.div>
  )
}
