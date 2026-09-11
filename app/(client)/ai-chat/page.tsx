'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Zap } from 'lucide-react'
import { Card, Button } from '@/app/components/common'
import { mockComputers, mockTariffs, mockDashboardStats } from '@/lib/data/mock-data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_QUESTIONS = [
  'What computers are available?',
  'How much are the hourly rates?',
  'Tell me about the premium PCs',
  'What are the best gaming computers?',
  'How do I book a computer?',
  'What payment methods do you accept?',
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        'Welcome to RONIN AI Assistant! I can help you with information about our computers, tariffs, availability, and bookings. What would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Available computers
    if (lowerMessage.includes('available') || lowerMessage.includes('free')) {
      const available = mockComputers.filter((c) => c.status === 'available')
      return `We have ${available.length} computers available right now:

${available
  .slice(0, 5)
  .map((c) => `• ${c.number}: ${c.name} - $${c.price_per_hour}/hour`)
  .join('\n')}

${available.length > 5 ? `...and ${available.length - 5} more!` : ''}

Would you like to book one?`
    }

    // Pricing information
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return `Here are our current tariffs:

${mockTariffs
  .map((t) => `• ${t.name}: $${t.price} (${t.duration_minutes} minutes)`)
  .join('\n')}

Premium PCs range from $140-200/hour, Standard from $80-100, and Budget from $40-50.

What's your budget?`
    }

    // Premium computers
    if (lowerMessage.includes('premium') || lowerMessage.includes('best') || lowerMessage.includes('high-end')) {
      const premium = mockComputers.filter((c) => c.category === 'premium')
      return `We have ${premium.length} premium computers available:

${premium
  .slice(0, 3)
  .map((c) => `• ${c.number}: ${c.name}\n  CPU: ${c.specs.cpu}\n  GPU: ${c.specs.gpu}`)
  .join('\n\n')}

These are equipped with top-tier gaming hardware. Perfect for competitive gaming!`
    }

    // Standard computers
    if (lowerMessage.includes('standard') || lowerMessage.includes('mid-range')) {
      const standard = mockComputers.filter((c) => c.category === 'standard')
      return `We have ${standard.length} standard computers with excellent value:

• Strong GPUs (RTX 40-series)
• 16-32GB RAM
• 1440p high refresh rate monitors
• Price range: $80-100/hour

Great for most gaming needs!`
    }

    // Budget computers
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      const budget = mockComputers.filter((c) => c.category === 'budget')
      return `We have ${budget.length} budget-friendly computers at just $40-50/hour.

They're perfect for:
• Casual gaming
• Esports titles (CS2, Valorant, Dota 2)
• Streaming
• Study sessions

These are great value for money!`
    }

    // Booking information
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('booking')) {
      return `Booking with us is super easy:

1. Go to "Computers" to see available PCs
2. Choose your computer and time slot
3. Select a tariff package
4. Complete payment
5. Get your receipt with 4-digit code

You can book from 1 hour up to 8 hours per session. Want to browse available computers now?`
    }

    // Payment methods
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return `We accept:

• Electronic wallet (e-wallet)
• Card payments (we're adding this soon)
• Mobile banking

All payments are instant and secure. You'll get a receipt with a 4-digit code immediately after payment.`
    }

    // Status and stats
    if (lowerMessage.includes('busy') || lowerMessage.includes('status') || lowerMessage.includes('how many')) {
      return `Current status:

• Available: ${mockDashboardStats.available_computers}
• Busy: ${mockDashboardStats.busy_computers}
• Reserved: ${mockDashboardStats.reserved_computers}
• Maintenance: ${mockDashboardStats.maintenance_computers}

We're running smoothly! Most computers are available right now.`
    }

    // About RONIN
    if (lowerMessage.includes('ronin') || lowerMessage.includes('about') || lowerMessage.includes('who are you')) {
      return `I'm the RONIN AI Assistant! I'm here to help you navigate our premium gaming club.

RONIN features:
• 30+ high-end gaming computers
• Flexible hourly booking system
• Real-time availability tracking
• Instant payment & receipts
• Competitive gaming environment

We're open 24/7 for your gaming pleasure!`
    }

    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('how to')) {
      return `I can help you with:

1. **Viewing Computers** - Browse our 30+ gaming PCs by category
2. **Checking Prices** - Our flexible tariff options
3. **Making Bookings** - Reserve your spot in seconds
4. **Payment Info** - Safe, instant payment processing
5. **Checking Status** - Real-time computer availability

What would you like to know more about?`
    }

    // Default response
    return `That's a great question! I can help you with information about RONIN Computer Club. 

You can ask me about:
• Available computers and their specs
• Pricing and tariff options
• How to make a booking
• Computer status and availability
• Payment methods

What would you like to know?`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 500)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateAIResponse(question),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      }, 500)
    }, 100)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">RONIN AI Assistant</h1>
            <p className="text-slate-400">Ask me anything about our gaming club</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="space-y-6">
        {/* Messages */}
        <Card className="h-96 overflow-y-auto p-6 space-y-4">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <p className="text-slate-400">Start a conversation...</p>
                </div>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg whitespace-pre-wrap text-sm ${
                      message.role === 'user'
                        ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/50'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-100" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-200" />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Card>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <p className="col-span-full text-sm text-slate-400 font-medium">
              Quick questions:
            </p>
            {QUICK_QUESTIONS.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleQuickQuestion(question)}
                className="text-left text-sm p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-200 text-slate-300 hover:text-cyan-300"
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me something..."
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            variant="primary"
            size="lg"
            glow
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
