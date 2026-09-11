'use client'

import React, { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${sizeStyles[size]} w-full mx-4`}
          >
            <div className="bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-2xl shadow-cyan-500/20 backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
                <h2 className="text-xl font-bold text-cyan-400">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {onConfirm && (
                <div className="flex gap-3 p-6 border-t border-slate-700/30">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={onClose}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
