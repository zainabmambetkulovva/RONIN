'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Moon, Sunrise } from 'lucide-react'
import { Card, Button } from '@/app/components/common'
import { mockTariffs } from '@/lib/data/mock-data'

const typeIcons = {
  hourly: Clock,
  night: Moon,
  morning: Sunrise,
}

export default function PricingPage() {
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null)

  const tariffsByType = {
    hourly: mockTariffs.filter((t) => t.type === 'hourly'),
    special: mockTariffs.filter((t) => t.type !== 'hourly'),
  }

  const features = [
    'Access to all 30+ computers',
    'Real-time availability tracking',
    'Instant booking confirmation',
    'Electronic receipt with QR code',
    '24/7 support',
    'Free computer maintenance',
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-white">Flexible Pricing</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Choose the perfect package for your gaming session. All bookings include instant payment
          and digital receipts.
        </p>
      </motion.div>

      {/* Hourly Tariffs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="text-cyan-400" size={28} />
          Hourly Packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tariffsByType.hourly.map((tariff, index) => {
            const isSelected = selectedTariff === tariff.id
            const isPopular = tariff.id === '3' // 5 Hours is popular

            return (
              <motion.div
                key={tariff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  className={`h-full relative transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-cyan-400' : ''
                  } ${isPopular ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-6 pt-4">
                    <h3 className="text-xl font-bold text-white mb-2">{tariff.name}</h3>
                    <p className="text-slate-400 text-sm">{tariff.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="text-4xl font-black text-cyan-400 mb-2">
                      ${tariff.price}
                    </div>
                    <p className="text-slate-400 text-sm">
                      {tariff.duration_minutes} minutes gaming
                    </p>
                  </div>

                  <div className="mb-6 space-y-3">
                    {features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => setSelectedTariff(tariff.id)}
                    glow={isSelected}
                  >
                    {isSelected ? 'Selected' : 'Choose Plan'}
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Special Packages */}
      {tariffsByType.special.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Moon className="text-purple-400" size={28} />
            Special Packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tariffsByType.special.map((tariff, index) => {
              const IconComponent = typeIcons[tariff.type as keyof typeof typeIcons] || Clock
              const isSelected = selectedTariff === tariff.id

              return (
                <motion.div
                  key={tariff.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className={`h-full transition-all duration-300 ${
                      isSelected ? 'ring-2 ring-purple-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{tariff.name}</h3>
                        <p className="text-slate-400 text-sm">{tariff.description}</p>
                      </div>
                      <IconComponent className="text-purple-400 flex-shrink-0" size={32} />
                    </div>

                    <div className="mb-6">
                      <div className="text-3xl font-black text-purple-400 mb-2">
                        ${tariff.price}
                      </div>
                      <p className="text-slate-400 text-sm">
                        {tariff.duration_minutes} minutes gaming
                      </p>
                    </div>

                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedTariff(tariff.id)}
                    >
                      {isSelected ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-slate-700/50 rounded-lg p-8"
      >
        <h3 className="text-xl font-bold text-white mb-4">Why Choose RONIN?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Premium Hardware',
              description: 'Latest GPUs, CPUs, and high-refresh monitors',
            },
            {
              title: 'Instant Booking',
              description: 'Check availability and book in seconds',
            },
            {
              title: 'Secure Payment',
              description: 'Fast, encrypted transactions with receipts',
            },
            {
              title: 'Professional Support',
              description: 'Available 24/7 to help with any issues',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <h4 className="font-bold text-white mb-2">{item.title}</h4>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Price Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Price Comparison by Category</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-300 font-bold">Computer Category</th>
                <th className="text-center py-4 px-4 text-slate-300 font-bold">Hourly Rate</th>
                <th className="text-center py-4 px-4 text-slate-300 font-bold">Quality Level</th>
                <th className="text-center py-4 px-4 text-slate-300 font-bold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  category: 'Premium',
                  rate: '$140-200',
                  quality: 'Ultra High',
                  bestFor: 'Competitive Gaming',
                },
                {
                  category: 'Standard',
                  rate: '$80-100',
                  quality: 'High',
                  bestFor: 'General Gaming',
                },
                {
                  category: 'Budget',
                  rate: '$40-50',
                  quality: 'Good',
                  bestFor: 'Casual Gaming',
                },
              ].map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-4 text-white font-medium">{row.category}</td>
                  <td className="py-4 px-4 text-center text-cyan-400 font-bold">{row.rate}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{row.quality}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{row.bestFor}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
