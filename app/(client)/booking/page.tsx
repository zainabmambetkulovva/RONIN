'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Card, Button, Modal, useToast } from '@/app/components/common'
import { mockComputers, mockTariffs } from '@/lib/data/mock-data'

type BookingStep = 'computer' | 'date-time' | 'tariff' | 'review' | 'payment'

interface BookingData {
  computer: typeof mockComputers[0] | null
  date: string
  startTime: string
  duration: number
  tariff: typeof mockTariffs[0] | null
  customerName: string
  customerPhone: string
}

export default function BookingPage() {
  const { showToast } = useToast()
  const [currentStep, setCurrentStep] = useState<BookingStep>('computer')
  const [bookingData, setBookingData] = useState<BookingData>({
    computer: null,
    date: '',
    startTime: '',
    duration: 60,
    tariff: null,
    customerName: '',
    customerPhone: '',
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const availableComputers = mockComputers.filter((pc) => pc.status === 'available')

  const steps: BookingStep[] = ['computer', 'date-time', 'tariff', 'review', 'payment']
  const stepIndex = steps.indexOf(currentStep)

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1])
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1])
    }
  }

  const handleConfirmBooking = () => {
    setShowConfirmation(true)
    showToast('Booking confirmed! Check your email for details.', 'success', 3000)
  }

  const calculateTotal = () => {
    if (!bookingData.computer || !bookingData.tariff) return 0
    return bookingData.tariff.price
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Book Your Gaming Session</h1>
        <p className="text-slate-400">Complete your reservation in just 4 steps</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              {/* Circle */}
              <motion.div
                animate={{
                  scale: stepIndex === index ? 1.1 : 1,
                  backgroundColor: stepIndex >= index ? '#06b6d4' : '#475569',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
              >
                {stepIndex > index ? (
                  <Check size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Line */}
              {index < steps.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: stepIndex > index ? '#06b6d4' : '#334155',
                  }}
                  className="flex-1 h-1 mx-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Names */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Select Computer</span>
          <span>Date & Time</span>
          <span>Tariff</span>
          <span>Review</span>
          <span>Payment</span>
        </div>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'computer' && (
          <motion.div
            key="computer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">
                Choose a Computer
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {availableComputers.map((pc) => (
                  <motion.button
                    key={pc.id}
                    onClick={() => setBookingData({ ...bookingData, computer: pc })}
                    whileHover={{ scale: 1.02 }}
                    className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      bookingData.computer?.id === pc.id
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-slate-700/50 hover:border-cyan-400/50 bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-white">{pc.name}</p>
                        <p className="text-sm text-cyan-400">{pc.number}</p>
                      </div>
                      <span className="text-lg font-bold text-cyan-400">
                        ${pc.price_per_hour}/h
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <p>{pc.specs.cpu}</p>
                      <p>{pc.specs.gpu}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'date-time' && (
          <motion.div
            key="date-time"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">
                When would you like to play?
              </h2>

              <div className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, startTime: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Duration Preview */}
                {bookingData.date && bookingData.startTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                  >
                    <p className="text-sm text-slate-300 mb-2">
                      Booking Summary:
                    </p>
                    <p className="text-cyan-400 font-bold">
                      {bookingData.date} at {bookingData.startTime}
                    </p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'tariff' && (
          <motion.div
            key="tariff"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">
                Choose a Tariff
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTariffs.map((tariff) => (
                  <motion.button
                    key={tariff.id}
                    onClick={() => setBookingData({ ...bookingData, tariff })}
                    whileHover={{ scale: 1.02 }}
                    className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      bookingData.tariff?.id === tariff.id
                        ? 'border-purple-400 bg-purple-500/10'
                        : 'border-slate-700/50 hover:border-purple-400/50 bg-slate-800/50'
                    }`}
                  >
                    <p className="font-bold text-white mb-2">{tariff.name}</p>
                    <p className="text-2xl font-bold text-purple-400 mb-2">
                      ${tariff.price}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tariff.duration_minutes} minutes • {tariff.type}
                    </p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">
                Review Your Booking
              </h2>

              <div className="space-y-4">
                {/* Computer */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Computer</p>
                  <p className="text-lg font-bold text-white">
                    {bookingData.computer?.name} ({bookingData.computer?.number})
                  </p>
                </div>

                {/* Date & Time */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Date & Time</p>
                  <p className="text-lg font-bold text-white">
                    {bookingData.date} at {bookingData.startTime}
                  </p>
                </div>

                {/* Tariff */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Tariff</p>
                  <p className="text-lg font-bold text-white">
                    {bookingData.tariff?.name} - ${bookingData.tariff?.price}
                  </p>
                </div>

                {/* Customer Info */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={bookingData.customerName}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        customerName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone"
                    value={bookingData.customerPhone}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        customerPhone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-white">Total Amount</p>
                    <p className="text-3xl font-black text-cyan-400">
                      ${calculateTotal()}
                    </p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">
                Select Payment Method
              </h2>

              <div className="space-y-3 mb-8">
                {[
                  {
                    name: 'E-Wallet',
                    description: 'Pay instantly with your digital wallet',
                  },
                  { name: 'Card', description: 'Credit or Debit Card' },
                  { name: 'Mobile Banking', description: 'Bank transfer via mobile app' },
                ].map((method) => (
                  <motion.button
                    key={method.name}
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-4 rounded-lg border-2 border-slate-700/50 hover:border-cyan-400/50 bg-slate-800/50 text-left transition-all duration-200"
                  >
                    <p className="font-bold text-white">{method.name}</p>
                    <p className="text-sm text-slate-400">{method.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-8">
                <p className="text-sm text-green-400 font-medium mb-2">
                  ✓ Secure Payment
                </p>
                <p className="text-xs text-slate-300">
                  All transactions are encrypted and secure
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 mt-8"
      >
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={stepIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </Button>

        <div className="flex-1" />

        {currentStep !== 'payment' ? (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={
              (currentStep === 'computer' && !bookingData.computer) ||
              (currentStep === 'date-time' &&
                (!bookingData.date || !bookingData.startTime)) ||
              (currentStep === 'tariff' && !bookingData.tariff)
            }
            glow
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleConfirmBooking}
            glow
            className="flex items-center gap-2"
          >
            <Check size={18} />
            Complete Booking
          </Button>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Booking Confirmed!"
        size="md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>

          <div>
            <p className="text-lg font-bold text-white mb-2">
              Your booking has been confirmed!
            </p>
            <p className="text-slate-400">
              A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="space-y-3 text-left p-4 bg-slate-800/50 rounded-lg">
            <div>
              <p className="text-xs text-slate-400">Booking Reference</p>
              <p className="text-lg font-mono font-bold text-cyan-400">BK-{Date.now().toString().slice(-6)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Receipt Code</p>
              <p className="text-lg font-mono font-bold text-cyan-400">
                {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            glow
            onClick={() => {
              setShowConfirmation(false)
              setCurrentStep('computer')
              setBookingData({
                computer: null,
                date: '',
                startTime: '',
                duration: 60,
                tariff: null,
                customerName: '',
                customerPhone: '',
              })
            }}
          >
            Done
          </Button>
        </motion.div>
      </Modal>
    </div>
  )
}
