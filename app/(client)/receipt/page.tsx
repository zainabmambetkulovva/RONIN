'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, Copy, CheckCircle } from 'lucide-react'
import { Card, Button } from '@/app/components/common'
import { mockReceipts } from '@/lib/data/mock-data'

export default function ReceiptPage() {
  const [selectedReceipt, setSelectedReceipt] = useState(mockReceipts[0])
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedReceipt.receipt_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple QR code placeholder (in real app, use qrcode library)
  const QRCodePlaceholder = () => (
    <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center font-mono text-sm text-gray-800 overflow-hidden">
      <div className="grid grid-cols-10 gap-px">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <CheckCircle className="text-green-400" size={32} />
          <h1 className="text-4xl font-bold text-white">Receipt</h1>
        </div>
        <p className="text-slate-400">Your electronic receipt</p>
      </motion.div>

      {/* Receipt Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          {/* Receipt Header */}
          <div className="p-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700/50 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
              RONIN Computer Club
            </p>
            <h2 className="text-3xl font-black text-cyan-400 font-mono mb-2">
              {selectedReceipt.receipt_code}
            </h2>
            <p className="text-sm text-slate-300">
              {selectedReceipt.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* QR Code */}
          <div className="p-8 flex justify-center border-b border-slate-700/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <QRCodePlaceholder />
            </motion.div>
          </div>

          {/* Receipt Details */}
          <div className="p-8 space-y-6">
            {/* Customer Info */}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                Customer
              </p>
              <p className="text-lg font-bold text-white">
                {selectedReceipt.customer_name}
              </p>
              <p className="text-sm text-slate-400">{selectedReceipt.customer_phone}</p>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                  Computer
                </p>
                <p className="text-lg font-bold text-cyan-400">
                  {selectedReceipt.computer_number}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                  Category
                </p>
                <p className="text-lg font-bold text-cyan-400 capitalize">
                  {selectedReceipt.computer_category}
                </p>
              </div>
            </div>

            {/* Time Info */}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                Session Time
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Start</p>
                  <p className="text-white font-mono">
                    {selectedReceipt.start_time.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">End</p>
                  <p className="text-white font-mono">
                    {selectedReceipt.end_time.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Tariff & Price */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                  Tariff
                </p>
                <p className="text-lg font-bold text-white">
                  {selectedReceipt.tariff_name}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedReceipt.duration_minutes} minutes
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                  Amount
                </p>
                <p className="text-2xl font-black text-cyan-400">
                  ${selectedReceipt.price}
                </p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-400" />
                <p className="text-sm font-bold text-green-400 uppercase">
                  Payment Confirmed
                </p>
              </div>
              <p className="text-xs text-slate-400">
                via {selectedReceipt.payment_method.replace('_', ' ')}
              </p>
            </div>

            {/* Session Validity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
            >
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                Session Valid For
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-400 font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-slate-400">remaining</span>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="p-8 border-t border-slate-700/50 space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download PDF
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share
              </Button>

              <Button
                variant={copied ? 'primary' : 'ghost'}
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleCopyCode}
              >
                <Copy size={18} />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-xs text-slate-400 space-y-2"
      >
        <p>Please present this receipt code at the computer terminal to start your session</p>
        <p className="text-slate-500">
          Receipt expires when the session ends • Keep this receipt for your records
        </p>
      </motion.div>

      {/* Other Receipts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-12"
      >
        <h3 className="text-lg font-bold text-white mb-4">Your Recent Receipts</h3>
        <div className="space-y-3">
          {mockReceipts.map((receipt) => (
            <motion.button
              key={receipt.id}
              onClick={() => setSelectedReceipt(receipt)}
              whileHover={{ x: 4 }}
              className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                selectedReceipt.id === receipt.id
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-bold text-cyan-400">
                    {receipt.receipt_code}
                  </p>
                  <p className="text-xs text-slate-400">{receipt.computer_number}</p>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  ${receipt.price}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
