'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react'
import { Card, Button, Modal, useToast } from '@/app/components/common'
import { mockBookings, mockComputers, mockTariffs } from '@/lib/data/mock-data'

interface NewOrder {
  customerName: string
  customerPhone: string
  computerId: string
  tariffId: string
  startDate: string
  startTime: string
}

export default function OrdersPage() {
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState(mockBookings)
  const [formData, setFormData] = useState<NewOrder>({
    customerName: '',
    customerPhone: '',
    computerId: '',
    tariffId: '',
    startDate: '',
    startTime: '',
  })

  const filteredOrders = orders.filter((booking) =>
    booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateOrder = () => {
    if (
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.computerId ||
      !formData.tariffId ||
      !formData.startDate ||
      !formData.startTime
    ) {
      showToast('Please fill in all fields', 'warning', 3000)
      return
    }

    const selectedTariff = mockTariffs.find((t) => t.id === formData.tariffId)
    const selectedComputer = mockComputers.find((c) => c.id === formData.computerId)

    if (!selectedTariff || !selectedComputer) {
      showToast('Invalid tariff or computer selected', 'error', 3000)
      return
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + selectedTariff.duration_minutes * 60 * 1000)

    const newOrder = {
      id: (orders.length + 1).toString(),
      booking_number: `BK-${String(orders.length + 1).padStart(3, '0')}`,
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      computer_id: formData.computerId,
      computer_number: selectedComputer.number,
      tariff_id: formData.tariffId,
      tariff_snapshot: {
        id: selectedTariff.id,
        name: selectedTariff.name,
        price: selectedTariff.price,
        duration_minutes: selectedTariff.duration_minutes,
        type: selectedTariff.type,
      },
      start_time: startDateTime,
      end_time: endDateTime,
      duration_minutes: selectedTariff.duration_minutes,
      total_price: selectedTariff.price,
      payment_status: 'pending' as const,
      booking_status: 'confirmed' as const,
      created_by: 'manager' as const,
      created_at: new Date(),
      updated_at: new Date(),
    }

    setOrders([...orders, newOrder])
    setShowModal(false)
    setFormData({
      customerName: '',
      customerPhone: '',
      computerId: '',
      tariffId: '',
      startDate: '',
      startTime: '',
    })
    showToast(`Order ${newOrder.booking_number} created successfully!`, 'success', 3000)
  }

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id))
    showToast('Order deleted', 'info', 2000)
  }

  const availableComputers = mockComputers.filter((c) => c.status === 'available')

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-slate-400">Manage and track all customer bookings</p>
        </div>
        <Button
          variant="primary"
          glow
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          New Order
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Orders', value: orders.length, color: 'from-purple-500 to-pink-500' },
          {
            label: 'Confirmed',
            value: orders.filter((o) => o.booking_status === 'confirmed').length,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Active',
            value: orders.filter((o) => o.booking_status === 'active').length,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Pending Payment',
            value: orders.filter((o) => o.payment_status === 'pending').length,
            color: 'from-orange-500 to-yellow-500',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-slate-700/50 rounded-lg p-4 text-center`}
          >
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4"
      >
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={18} />
          Filter
        </Button>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Order ID</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Customer</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Computer</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-bold">Time</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Price</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Status</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-white font-mono font-bold">
                        {order.booking_number}
                      </td>
                      <td className="py-4 px-4 text-white">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-slate-400">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{order.computer_number}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm">
                        {order.start_time.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {order.end_time.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-4 text-center text-cyan-400 font-bold">
                        ${order.total_price}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.booking_status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {order.booking_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center flex gap-2 justify-center">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* New Order Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Order"
        onConfirm={handleCreateOrder}
        confirmText="Create Order"
        size="lg"
      >
        <div className="space-y-4">
          {/* Customer Info */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+996 555 123-456"
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Computer & Tariff */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Computer *
              </label>
              <select
                value={formData.computerId}
                onChange={(e) =>
                  setFormData({ ...formData, computerId: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">Select a computer</option>
                {availableComputers.map((pc) => (
                  <option key={pc.id} value={pc.id}>
                    {pc.number} - {pc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tariff *
              </label>
              <select
                value={formData.tariffId}
                onChange={(e) =>
                  setFormData({ ...formData, tariffId: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">Select a tariff</option>
                {mockTariffs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} - ${t.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Preview */}
          {formData.tariffId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg"
            >
              <p className="text-sm text-slate-300 mb-2">Order Preview:</p>
              {formData.tariffId && (
                <>
                  <p className="text-sm text-white">
                    <span className="text-slate-400">Tariff:</span>{' '}
                    {mockTariffs.find((t) => t.id === formData.tariffId)?.name} (
                    {mockTariffs.find((t) => t.id === formData.tariffId)?.duration_minutes} min)
                  </p>
                  <p className="text-sm font-bold text-purple-400">
                    Total: ${mockTariffs.find((t) => t.id === formData.tariffId)?.price}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </Modal>
    </div>
  )
}
