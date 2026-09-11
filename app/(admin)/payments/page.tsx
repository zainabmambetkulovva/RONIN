'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Download } from 'lucide-react'
import { Card, Button } from '@/app/components/common'
import { mockPayments } from '@/lib/data/mock-data'

export default function AdminPaymentsPage() {
  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
        <p className="text-slate-400">Monitor and manage payment transactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Transaction ID</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Booking</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Amount</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Method</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Status</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30"
                  >
                    <td className="py-4 px-4 text-white font-mono">{payment.transaction_id}</td>
                    <td className="py-4 px-4 text-white">{payment.booking_id}</td>
                    <td className="py-4 px-4 text-center text-cyan-400 font-bold">
                      ${payment.amount}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-300 capitalize">
                      {payment.method.replace('_', ' ')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button variant="ghost" size="sm">
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
