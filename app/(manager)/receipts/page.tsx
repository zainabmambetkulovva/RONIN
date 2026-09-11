'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Archive, ArchiveRestore } from 'lucide-react'
import { Card, Button, useToast } from '@/app/components/common'
import { mockReceipts } from '@/lib/data/mock-data'

interface ReceiptItem {
  id: string
  receipt_code: string
  booking_id: string
  customer_name: string
  customer_phone: string
  computer_number: string
  computer_category: string
  tariff_name: string
  date: Date
  day_of_week: string
  start_time: Date
  end_time: Date
  duration_minutes: number
  price: number
  payment_method: string
  payment_status: string
  status: 'active' | 'archived'
  created_at: Date
  expires_at: Date
}

export default function ReceiptsPage() {
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [receipts, setReceipts] = useState<ReceiptItem[]>(
    mockReceipts.map((r) => ({ ...r, status: 'active' as const }))
  )

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.receipt_code.includes(searchTerm) ||
      receipt.customer_name.toLowerCase().includes(searchTerm.toLowerCase())

    if (showArchived) {
      return matchesSearch && receipt.status === 'archived'
    } else {
      return matchesSearch && receipt.status === 'active'
    }
  })

  const handleArchive = (id: string) => {
    setReceipts(
      receipts.map((r) =>
        r.id === id ? { ...r, status: 'archived' as const } : r
      )
    )
    showToast('Receipt archived successfully', 'info', 2000)
  }

  const handleRestore = (id: string) => {
    setReceipts(
      receipts.map((r) => (r.id === id ? { ...r, status: 'active' as const } : r))
    )
    showToast('Receipt restored', 'info', 2000)
  }

  const handleDownload = (receipt: ReceiptItem) => {
    showToast(`Downloading receipt ${receipt.receipt_code}...`, 'success', 2000)
  }

  const activeCount = receipts.filter((r) => r.status === 'active').length
  const archivedCount = receipts.filter((r) => r.status === 'archived').length

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Receipts Management</h1>
        <p className="text-slate-400">Track and manage all customer receipts</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          {
            label: 'Active Receipts',
            value: activeCount,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Archived',
            value: archivedCount,
            color: 'from-slate-500 to-gray-500',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-slate-700/50 rounded-lg p-4 text-center`}
          >
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <div className="flex-1 w-full relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by receipt code or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={showArchived ? 'outline' : 'primary'}
            onClick={() => setShowArchived(false)}
            className="whitespace-nowrap"
          >
            Active
          </Button>
          <Button
            variant={showArchived ? 'primary' : 'outline'}
            onClick={() => setShowArchived(true)}
            className="whitespace-nowrap flex items-center gap-2"
          >
            <Archive size={16} />
            Archived
          </Button>
        </div>
      </motion.div>

      {/* Receipts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredReceipts.length > 0 ? (
          filteredReceipts.map((receipt, index) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card>
                {/* Receipt Code */}
                <div className="mb-4">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                    Receipt Code
                  </p>
                  <p className="text-2xl font-mono font-black text-blue-400">
                    {receipt.receipt_code}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Customer:</span>
                    <span className="text-white font-medium">
                      {receipt.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Computer:</span>
                    <span className="text-white font-medium">{receipt.computer_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white font-medium">
                      {receipt.duration_minutes} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-blue-400 font-bold">${receipt.price}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded mb-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      receipt.status === 'active'
                        ? 'bg-green-400 animate-pulse'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-xs text-slate-300 uppercase tracking-wide">
                    {receipt.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleDownload(receipt)}
                  >
                    <Download size={14} />
                    Download
                  </Button>
                  <Button
                    variant={receipt.status === 'active' ? 'ghost' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (receipt.status === 'active') {
                        handleArchive(receipt.id)
                      } else {
                        handleRestore(receipt.id)
                      }
                    }}
                    className="flex items-center justify-center"
                  >
                    {receipt.status === 'active' ? (
                      <Archive size={14} />
                    ) : (
                      <ArchiveRestore size={14} />
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20"
          >
            <p className="text-lg text-slate-400 mb-2">
              {showArchived ? 'No archived receipts' : 'No active receipts'}
            </p>
            <p className="text-sm text-slate-500">
              {searchTerm ? 'Try a different search term' : 'Create a new booking to generate receipts'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
