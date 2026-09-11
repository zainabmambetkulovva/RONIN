// Admin Panel Types

export type ComputerStatus = 'available' | 'playing' | 'reserved' | 'maintenance'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type UserRole = 'admin' | 'manager' | 'moderator'
export type EquipmentStatus = 'working' | 'needs_repair' | 'broken' | 'maintenance'

export interface Computer {
  id: string
  number: string
  name: string
  zone: string
  status: ComputerStatus
  cpu: string
  gpu: string
  ram: string
  monitor: string
  keyboard: string
  mouse: string
  headset: string
  pricePerHour: number
  currentUser?: string
  sessionEndTime?: string
  tariff?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  totalBookings: number
  totalSpent: number
  registrationDate: string
  lastLoginDate: string
  status: 'active' | 'blocked' | 'deleted'
}

export interface Booking {
  id: string
  bookingNumber: string
  user: { name: string; id: string }
  computer: { number: string; zone: string; id: string }
  date: string
  startTime: string
  duration: number
  price: number
  status: BookingStatus
  tariff: string
}

export interface Payment {
  id: string
  bookingId: string
  user: { name: string; id: string }
  amount: number
  method: 'cash' | 'card' | 'online'
  status: PaymentStatus
  date: string
}

export interface Tariff {
  id: string
  name: string
  description: string
  price: number
  zone: string
  minimumTime: number
  maximumTime?: number
  status: 'active' | 'inactive'
  bookingsCount: number
}

export interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  computer?: string
  condition: EquipmentStatus
  purchaseDate: string
  warranty: string
  status: 'active' | 'inactive'
}

export interface Review {
  id: string
  user: { name: string; avatar?: string }
  rating: number
  comment: string
  date: string
  status: 'published' | 'hidden'
}

export interface Administrator {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  lastLogin: string
  createdAt: string
  avatar?: string
}

export interface Notification {
  id: string
  type: 'booking' | 'booking_cancelled' | 'payment' | 'equipment' | 'user' | 'system'
  title: string
  message: string
  date: string
  read: boolean
  actionUrl?: string
}

export interface StatCard {
  title: string
  value: number | string
  description: string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: string
  color: string
}

export interface ChartData {
  name: string
  value: number
  date?: string
  [key: string]: any
}

export interface DashboardStats {
  totalComputers: number
  availableComputers: number
  activeSessions: number
  todayRevenue: number
  todayBookings: number
  totalUsers: number
  newUsers: number
  averageSessionPrice: number
}
