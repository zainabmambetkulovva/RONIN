'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gamepad2,
  MoreHorizontal,
  Download,
  X,
} from 'lucide-react'
import { Card, Button, Badge, Modal, useToast } from '@/app/components/common'
import { mockBookings } from '@/lib/data/mock-data'

export default function ProfilePage() {
  const { showToast } = useToast()
  const [showAllBookings, setShowAllBookings] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)
  const [showModal, setShowModal] = useState(false)

  const userStats = {
    totalBookings: 12,
    hoursPlayed: 48,
    totalSpent: 2400,
    lastBooking: new Date(Date.now() - 2 * 60 * 60 * 1000),
  }

  const displayedBookings = showAllBookings ? mockBookings : mockBookings.slice(0, 3)

  const openBookingDetails = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400'
      case 'completed':
        return 'bg-slate-500/20 text-slate-300'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your account and bookings</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex flex-col items-center text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center mb-4"
              >
                <User className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-1">Demo User</h2>
              <p className="text-slate-400 text-sm">Premium Member</p>

              {/* Member Badge */}
              <div className="mt-4 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
                <p className="text-xs text-cyan-400 font-bold uppercase">Active Member</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all">
                <Mail size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-white">user@ronin.club</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all">
                <Phone size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-white">+996 555 123-456</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all">
                <MapPin size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-white">Bishkek, Kyrgyzstan</p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20 mb-8">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Member Since</p>
              <p className="text-sm text-white font-mono">January 15, 2024</p>
            </div>

            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </Card>
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar size={20} className="text-cyan-400" />
                My Bookings
              </h3>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full">
                {mockBookings.length} Total
              </span>
            </div>

            {/* Bookings List */}
            <div className="space-y-3 mb-6">
              <AnimatePresence mode="wait">
                {displayedBookings.length > 0 ? (
                  displayedBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      onClick={() => openBookingDetails(booking)}
                      className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Gamepad2 size={14} className="text-cyan-400" />
                            <p className="font-bold text-white text-sm">
                              {booking.computer_number}
                            </p>
                            <p className="text-xs text-slate-400">
                              {booking.booking_number}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400 ml-5">
                            {booking.customer_name}
                          </p>
                        </div>

                        <div className="text-right">
                          <Badge variant="primary" className="mb-2">
                            {booking.booking_status}
                          </Badge>
                          <p className="font-bold text-cyan-400 text-sm">
                            ${booking.total_price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                          {booking.start_time.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {booking.end_time.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>{booking.duration_minutes} min</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Gamepad2 size={32} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No bookings yet</p>
                    <p className="text-xs text-slate-500">
                      Start your first gaming session
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View All Button */}
            {mockBookings.length > 3 && (
              <Button
                variant={showAllBookings ? 'outline' : 'primary'}
                className="w-full"
                onClick={() => setShowAllBookings(!showAllBookings)}
                glow={showAllBookings}
              >
                {showAllBookings ? 'Show Less' : `View All ${mockBookings.length} Bookings`}
              </Button>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            label: 'Total Bookings',
            value: userStats.totalBookings,
            icon: '📅',
            color: 'from-cyan-500 to-blue-500',
          },
          {
            label: 'Hours Played',
            value: userStats.hoursPlayed,
            icon: '⏱️',
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Total Spent',
            value: `$${userStats.totalSpent}`,
            icon: '💰',
            color: 'from-purple-500 to-pink-500',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.08 }}
            whileHover={{ y: -4 }}
            className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-slate-700/50 rounded-lg p-6 text-center hover:border-slate-600/50 transition-all`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                showToast('Redirecting to booking...', 'info', 2000)
              }}
            >
              <Calendar size={18} />
              New Booking
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                showToast('Receipt downloaded! Check your downloads folder.', 'success', 3000)
              }}
            >
              <Download size={18} />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                showToast('More options coming soon!', 'info', 2000)
              }}
            >
              <MoreHorizontal size={18} />
              More Options
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedBooking(null)
        }}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Booking Number
                </p>
                <p className="text-lg font-mono font-bold text-cyan-400">
                  {selectedBooking.booking_number}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Computer
                </p>
                <p className="text-lg font-bold text-white">
                  {selectedBooking.computer_number}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-sm">Customer</span>
                <span className="text-white font-medium">
                  {selectedBooking.customer_name}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-sm">Tariff</span>
                <span className="text-white font-medium">
                  {selectedBooking.tariff_snapshot.name} - $
                  {selectedBooking.tariff_snapshot.price}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-sm">Duration</span>
                <span className="text-white font-medium">
                  {selectedBooking.duration_minutes} minutes
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-sm">Time</span>
                <span className="text-white font-mono text-sm">
                  {selectedBooking.start_time.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {selectedBooking.end_time.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-sm">Status</span>
                <Badge variant="primary">{selectedBooking.booking_status}</Badge>
              </div>

              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between">
                <span className="text-slate-300 font-medium">Total Amount</span>
                <span className="text-2xl font-black text-cyan-400">
                  ${selectedBooking.total_price}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => {
                  showToast('Receipt downloaded!', 'success', 2000)
                }}
              >
                <Download size={16} />
                Download
              </Button>
              <Button
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => setShowModal(false)}
              >
                <X size={16} />
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  )
}
