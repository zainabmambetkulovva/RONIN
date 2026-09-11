// ==================== COMPUTER ====================
export type ComputerStatus = 'available' | 'busy' | 'reserved' | 'maintenance'
export type ComputerCategory = 'premium' | 'standard' | 'budget'

export interface ComputerSpecs {
  cpu: string
  gpu: string
  ram: string
  monitor: string
  keyboard: string
  mouse: string
  headset: string
}

export interface Computer {
  id: string
  number: string
  name: string
  category: ComputerCategory
  specs: ComputerSpecs
  price_per_hour: number
  status: ComputerStatus
  booking_until?: Date
  created_at: Date
  updated_at: Date
}

// ==================== TARIFF ====================
export type TariffType = 'hourly' | 'night' | 'morning' | 'custom'

export interface Tariff {
  id: string
  name: string
  type: TariffType
  duration_minutes: number
  price: number
  description?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ==================== BOOKING ====================
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'active'

export interface TariffSnapshot {
  id: string
  name: string
  price: number
  duration_minutes: number
  type: TariffType
}

export interface Booking {
  id: string
  booking_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  computer_id: string
  computer_number: string
  tariff_id: string
  tariff_snapshot: TariffSnapshot
  start_time: Date
  end_time: Date
  duration_minutes: number
  total_price: number
  payment_status: PaymentStatus
  booking_status: BookingStatus
  created_by: 'customer' | 'manager'
  created_by_manager_id?: string
  notes?: string
  created_at: Date
  updated_at: Date
}

// ==================== PAYMENT ====================
export type PaymentMethod = 'electronic_wallet' | 'cash'

export interface Payment {
  id: string
  booking_id: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transaction_id?: string
  refund_reason?: string
  created_at: Date
  updated_at: Date
}

// ==================== RECEIPT ====================
export interface Receipt {
  id: string
  receipt_code: string // 4-digit: 4821
  booking_id: string
  customer_name: string
  customer_phone: string
  computer_number: string
  computer_category: ComputerCategory
  tariff_name: string
  date: Date
  day_of_week: string // Monday, Tuesday, etc
  start_time: Date
  end_time: Date
  duration_minutes: number
  price: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  status: 'active' | 'expired'
  qr_code?: string
  created_at: Date
  expires_at: Date
}

// ==================== GAME SESSION ====================
export interface GameSession {
  id: string
  receipt_id: string
  booking_id: string
  computer_id: string
  customer_name: string
  start_time: Date
  end_time: Date
  actual_end_time?: Date
  status: 'active' | 'completed' | 'cancelled'
  started_by_manager?: string
  ended_by_manager?: string
  created_at: Date
  updated_at: Date
}

// ==================== USER ====================
export type UserRole = 'customer' | 'manager' | 'admin'

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  age?: number
  role: UserRole
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ==================== MANAGER ====================
export interface Manager extends User {
  role: 'manager'
  manager_id: string
  assigned_to_branch?: string
  permissions: string[]
}

// ==================== ADMIN ====================
export interface Admin extends User {
  role: 'admin'
  admin_id: string
  permissions: string[]
}

// ==================== NOTIFICATION ====================
export type NotificationType = 'booking' | 'payment' | 'session' | 'system' | 'promotion'

export interface Notification {
  id: string
  user_id?: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  created_at: Date
}

// ==================== SEARCH & FILTER ====================
export interface ComputerFilter {
  category?: ComputerCategory
  status?: ComputerStatus
  min_price?: number
  max_price?: number
  specs?: Partial<ComputerSpecs>
}

export interface BookingFilter {
  start_date?: Date
  end_date?: Date
  customer_name?: string
  computer_id?: string
  booking_status?: BookingStatus
  payment_status?: PaymentStatus
}

// ==================== PREFERENCES ====================
export type Language = 'kg' | 'ru' | 'en'
export type Theme = 'dark' | 'light' | 'system'

export interface UserPreferences {
  language: Language
  theme: Theme
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
}

// ==================== RECOMMENDATION ====================
export type RecommendationType = 'best' | 'optimal' | 'powerful' | 'suitable'

export interface ComputerRecommendation {
  computer: Computer
  type: RecommendationType
  reason: string
  rating: number
}

// ==================== AI CONTEXT ====================
export interface AIContext {
  available_computers: Computer[]
  tariffs: Tariff[]
  user_bookings?: Booking[]
  club_info: {
    name: string
    location: string
    working_hours: {
      open: string
      close: string
    }
    total_computers: number
    average_price: number
  }
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  total_computers: number
  available_computers: number
  busy_computers: number
  reserved_computers: number
  maintenance_computers: number
  today_revenue: number
  today_bookings: number
  active_sessions: number
  total_users: number
}

// ==================== MANAGER STATS ====================
export interface ManagerStats {
  active_receipts: number
  total_today_revenue: number
  pending_orders: number
  active_sessions: number
  average_session_time: number
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}
