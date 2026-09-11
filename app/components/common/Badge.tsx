'use client'

import React from 'react'

type BadgeVariant = 
  | 'available' | 'busy' | 'reserved' | 'maintenance'
  | 'success' | 'warning' | 'danger' | 'info'
  | 'paid' | 'pending' | 'failed'
  | 'active' | 'expired' | 'inactive'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  animated?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  // Computer statuses
  available: 'bg-green-500/20 text-green-300 border border-green-500/50',
  busy: 'bg-red-500/20 text-red-300 border border-red-500/50',
  reserved: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
  maintenance: 'bg-gray-500/20 text-gray-300 border border-gray-500/50',

  // General statuses
  success: 'bg-green-500/20 text-green-300 border border-green-500/50',
  warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
  danger: 'bg-red-500/20 text-red-300 border border-red-500/50',
  info: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50',

  // Payment statuses
  paid: 'bg-green-500/20 text-green-300 border border-green-500/50',
  pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
  failed: 'bg-red-500/20 text-red-300 border border-red-500/50',

  // Activity statuses
  active: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50',
  expired: 'bg-red-500/20 text-red-300 border border-red-500/50',
  inactive: 'bg-gray-500/20 text-gray-300 border border-gray-500/50',
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function Badge({
  variant,
  children,
  size = 'md',
  glow = false,
  animated = false,
}: BadgeProps) {
  const baseStyles = `
    inline-flex items-center gap-2 rounded-full font-medium
    transition-all duration-300
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${glow ? 'shadow-lg shadow-cyan-500/30' : ''}
    ${animated ? 'animate-pulse' : ''}
  `

  return (
    <span className={baseStyles}>
      <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
      {children}
    </span>
  )
}
