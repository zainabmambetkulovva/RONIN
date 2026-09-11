// Mock Data for RONIN Admin Panel
import {
  Computer,
  User,
  Booking,
  Payment,
  Tariff,
  Equipment,
  Review,
  Administrator,
  Notification,
  DashboardStats,
} from '../types'

// Mock Computers
export const mockComputers: Computer[] = [
  {
    id: '1',
    number: 'PC-01',
    name: 'Gaming Master Pro',
    zone: 'Premium Zone',
    status: 'available',
    cpu: 'Intel i9-13900K',
    gpu: 'RTX 4090',
    ram: '64GB DDR5',
    monitor: 'LG 4K 144Hz',
    keyboard: 'Corsair K95',
    mouse: 'Razer DeathAdder',
    headset: 'SteelSeries Arctis Pro',
    pricePerHour: 200,
  },
  {
    id: '2',
    number: 'PC-02',
    name: 'Pro Streamer Setup',
    zone: 'Premium Zone',
    status: 'playing',
    cpu: 'Intel i9-13900KS',
    gpu: 'RTX 4080',
    ram: '64GB DDR5',
    monitor: 'ASUS PG32UQXR',
    keyboard: 'Logitech G915',
    mouse: 'Logitech G Pro X',
    headset: 'Audeze LCD-GX',
    pricePerHour: 180,
    currentUser: 'Арсен Абелов',
    sessionEndTime: '2026-09-10 22:30',
    tariff: 'Premium 3h',
  },
  {
    id: '3',
    number: 'PC-03',
    name: 'Standard Gaming',
    zone: 'Standard Zone',
    status: 'available',
    cpu: 'Intel i7-13700K',
    gpu: 'RTX 4070',
    ram: '32GB DDR5',
    monitor: 'Dell S2721DGF',
    keyboard: 'Corsair K70',
    mouse: 'SteelSeries Rival 5',
    headset: 'HyperX CloudFlight',
    pricePerHour: 120,
  },
  {
    id: '4',
    number: 'PC-04',
    name: 'Entry Level',
    zone: 'Comfort Zone',
    status: 'reserved',
    cpu: 'Intel i5-13600K',
    gpu: 'RTX 3060',
    ram: '16GB DDR4',
    monitor: 'BenQ EW2480',
    keyboard: 'Logitech G213',
    mouse: 'Razer DeathAdder Essential',
    headset: 'Corsair HS50',
    pricePerHour: 80,
  },
  {
    id: '5',
    number: 'PC-05',
    name: 'Maintenance Unit',
    zone: 'Service Area',
    status: 'maintenance',
    cpu: 'Intel i7-12700K',
    gpu: 'RTX 3080',
    ram: '32GB DDR4',
    monitor: 'LG 27GL850',
    keyboard: 'Corsair K95',
    mouse: 'Razer DeathAdder',
    headset: 'SteelSeries Arctis 9',
    pricePerHour: 150,
  },
  {
    id: '6',
    number: 'PC-06',
    name: 'Gaming Standard',
    zone: 'Standard Zone',
    status: 'available',
    cpu: 'Intel i7-13700K',
    gpu: 'RTX 4070',
    ram: '32GB DDR5',
    monitor: 'ASUS PA278QV',
    keyboard: 'Corsair K70',
    mouse: 'SteelSeries Rival 3',
    headset: 'HyperX CloudAlpha',
    pricePerHour: 120,
  },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Арсен Абелов',
    email: 'arsen@example.com',
    phone: '+996 555 123-456',
    avatar: 'https://i.pravatar.cc/150?img=1',
    totalBookings: 45,
    totalSpent: 5400,
    registrationDate: '2025-03-15',
    lastLoginDate: '2026-09-10',
    status: 'active',
  },
  {
    id: '2',
    name: 'Нураидын Уметов',
    email: 'nuray@example.com',
    phone: '+996 555 234-567',
    avatar: 'https://i.pravatar.cc/150?img=2',
    totalBookings: 32,
    totalSpent: 3840,
    registrationDate: '2025-05-22',
    lastLoginDate: '2026-09-09',
    status: 'active',
  },
  {
    id: '3',
    name: 'Марина Сидорова',
    email: 'marina@example.com',
    phone: '+996 555 345-678',
    avatar: 'https://i.pravatar.cc/150?img=3',
    totalBookings: 18,
    totalSpent: 2160,
    registrationDate: '2025-07-10',
    lastLoginDate: '2026-09-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Азамат Беков',
    email: 'azamat@example.com',
    phone: '+996 555 456-789',
    avatar: 'https://i.pravatar.cc/150?img=4',
    totalBookings: 5,
    totalSpent: 600,
    registrationDate: '2026-08-20',
    lastLoginDate: '2026-08-25',
    status: 'blocked',
  },
  {
    id: '5',
    name: 'Элина Киргизова',
    email: 'elina@example.com',
    phone: '+996 555 567-890',
    avatar: 'https://i.pravatar.cc/150?img=5',
    totalBookings: 28,
    totalSpent: 3360,
    registrationDate: '2025-06-05',
    lastLoginDate: '2026-09-08',
    status: 'active',
  },
]

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    bookingNumber: 'BK-2609-001',
    user: { name: 'Арсен Абелов', id: '1' },
    computer: { number: 'PC-02', zone: 'Premium Zone', id: '2' },
    date: '2026-09-10',
    startTime: '20:00',
    duration: 180,
    price: 600,
    status: 'confirmed',
    tariff: 'Premium 3h',
  },
  {
    id: '2',
    bookingNumber: 'BK-2609-002',
    user: { name: 'Нураидын Уметов', id: '2' },
    computer: { number: 'PC-03', zone: 'Standard Zone', id: '3' },
    date: '2026-09-10',
    startTime: '18:30',
    duration: 120,
    price: 240,
    status: 'confirmed',
    tariff: 'Standard 2h',
  },
  {
    id: '3',
    bookingNumber: 'BK-2609-003',
    user: { name: 'Марина Сидорова', id: '3' },
    computer: { number: 'PC-04', zone: 'Comfort Zone', id: '4' },
    date: '2026-09-10',
    startTime: '19:00',
    duration: 120,
    price: 160,
    status: 'pending',
    tariff: 'Standard 2h',
  },
  {
    id: '4',
    bookingNumber: 'BK-2609-004',
    user: { name: 'Элина Киргизова', id: '5' },
    computer: { number: 'PC-06', zone: 'Standard Zone', id: '6' },
    date: '2026-09-11',
    startTime: '14:00',
    duration: 240,
    price: 480,
    status: 'confirmed',
    tariff: 'Standard 4h',
  },
  {
    id: '5',
    bookingNumber: 'BK-2609-005',
    user: { name: 'Азамат Беков', id: '4' },
    computer: { number: 'PC-01', zone: 'Premium Zone', id: '1' },
    date: '2026-09-12',
    startTime: '16:00',
    duration: 300,
    price: 1000,
    status: 'cancelled',
    tariff: 'Premium 5h',
  },
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: '1',
    bookingId: '1',
    user: { name: 'Арсен Абелов', id: '1' },
    amount: 600,
    method: 'card',
    status: 'paid',
    date: '2026-09-10',
  },
  {
    id: '2',
    bookingId: '2',
    user: { name: 'Нураидын Уметов', id: '2' },
    amount: 240,
    method: 'online',
    status: 'paid',
    date: '2026-09-10',
  },
  {
    id: '3',
    bookingId: '3',
    user: { name: 'Марина Сидорова', id: '3' },
    amount: 160,
    method: 'cash',
    status: 'pending',
    date: '2026-09-10',
  },
  {
    id: '4',
    bookingId: '4',
    user: { name: 'Элина Киргизова', id: '5' },
    amount: 480,
    method: 'card',
    status: 'paid',
    date: '2026-09-09',
  },
  {
    id: '5',
    bookingId: '5',
    user: { name: 'Азамат Беков', id: '4' },
    amount: 1000,
    method: 'online',
    status: 'refunded',
    date: '2026-09-08',
  },
]

// Mock Tariffs
export const mockTariffs: Tariff[] = [
  {
    id: '1',
    name: 'Comfort 1h',
    description: 'Базовый тариф на 1 час',
    price: 80,
    zone: 'Comfort Zone',
    minimumTime: 60,
    maximumTime: 480,
    status: 'active',
    bookingsCount: 128,
  },
  {
    id: '2',
    name: 'Standard 2h',
    description: 'Стандартный тариф на 2 часа',
    price: 240,
    zone: 'Standard Zone',
    minimumTime: 120,
    maximumTime: 480,
    status: 'active',
    bookingsCount: 245,
  },
  {
    id: '3',
    name: 'Premium 3h',
    description: 'Premium тариф на 3 часа',
    price: 600,
    zone: 'Premium Zone',
    minimumTime: 180,
    maximumTime: 600,
    status: 'active',
    bookingsCount: 89,
  },
  {
    id: '4',
    name: 'Night Package',
    description: 'Ночной пакет с 22:00 до 08:00',
    price: 600,
    zone: 'All Zones',
    minimumTime: 600,
    maximumTime: 600,
    status: 'active',
    bookingsCount: 156,
  },
  {
    id: '5',
    name: 'Morning Package',
    description: 'Утренний пакет с 08:00 до 14:00',
    price: 300,
    zone: 'All Zones',
    minimumTime: 360,
    maximumTime: 360,
    status: 'inactive',
    bookingsCount: 67,
  },
]

// Mock Equipment
export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Gaming Monitor',
    model: 'LG 4K 144Hz',
    serialNumber: 'LG-001-2026',
    computer: 'PC-01',
    condition: 'working',
    purchaseDate: '2024-01-15',
    warranty: '3 years',
    status: 'active',
  },
  {
    id: '2',
    name: 'Gaming Mouse',
    model: 'Razer DeathAdder V3',
    serialNumber: 'RZ-001-2026',
    computer: 'PC-02',
    condition: 'needs_repair',
    purchaseDate: '2023-06-10',
    warranty: '2 years',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    model: 'Corsair K95 Platinum',
    serialNumber: 'COR-001-2026',
    computer: 'PC-03',
    condition: 'working',
    purchaseDate: '2024-03-22',
    warranty: '2 years',
    status: 'active',
  },
]

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    user: { name: 'Арсен Абелов', avatar: 'https://i.pravatar.cc/150?img=1' },
    rating: 5,
    comment: 'Отличный клуб! Мощные компьютеры и хороший сервис.',
    date: '2026-09-08',
    status: 'published',
  },
  {
    id: '2',
    user: { name: 'Нураидын Уметов', avatar: 'https://i.pravatar.cc/150?img=2' },
    rating: 4,
    comment: 'Хорошее место для игр. Спокойная атмосфера.',
    date: '2026-09-07',
    status: 'published',
  },
  {
    id: '3',
    user: { name: 'Марина Сидорова', avatar: 'https://i.pravatar.cc/150?img=3' },
    rating: 5,
    comment: 'Лучший компьютерный клуб в городе! Рекомендую всем.',
    date: '2026-09-06',
    status: 'hidden',
  },
]

// Mock Administrators
export const mockAdministrators: Administrator[] = [
  {
    id: '1',
    name: 'Алан Касымов',
    email: 'alan@ronin.kg',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-09-10 14:30',
    createdAt: '2024-01-10',
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
  {
    id: '2',
    name: 'Динара Адилова',
    email: 'dinara@ronin.kg',
    role: 'manager',
    status: 'active',
    lastLogin: '2026-09-10 12:15',
    createdAt: '2024-06-20',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '3',
    name: 'Айдар Абденов',
    email: 'aydar@ronin.kg',
    role: 'moderator',
    status: 'active',
    lastLogin: '2026-09-09 18:45',
    createdAt: '2025-01-05',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Новое бронирование',
    message: 'Арсен Абелов забронировал PC-02 на 3 часа',
    date: '2026-09-10 19:45',
    read: false,
    actionUrl: '/admin/bookings/1',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Платеж получен',
    message: 'Оплачено 600 сом за бронирование BK-2609-001',
    date: '2026-09-10 19:50',
    read: false,
    actionUrl: '/admin/payments/1',
  },
  {
    id: '3',
    type: 'equipment',
    title: 'Проблема с оборудованием',
    message: 'Мышка Razer DeathAdder требует ремонта на PC-02',
    date: '2026-09-10 18:30',
    read: true,
    actionUrl: '/admin/equipment',
  },
  {
    id: '4',
    type: 'user',
    title: 'Новый пользователь',
    message: 'Азамат Беков зарегистрировался в клубе',
    date: '2026-09-09 14:20',
    read: true,
    actionUrl: '/admin/users',
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalComputers: 96,
  availableComputers: 72,
  activeSessions: 4,
  todayRevenue: 1440,
  todayBookings: 5,
  totalUsers: 340,
  newUsers: 12,
  averageSessionPrice: 280,
}

// Chart data for revenue
export const mockRevenueData = [
  { date: 'Sep 1', revenue: 2400, sessions: 8 },
  { date: 'Sep 2', revenue: 1398, sessions: 6 },
  { date: 'Sep 3', revenue: 9800, sessions: 32 },
  { date: 'Sep 4', revenue: 3908, sessions: 14 },
  { date: 'Sep 5', revenue: 4800, sessions: 18 },
  { date: 'Sep 6', revenue: 3800, sessions: 12 },
  { date: 'Sep 7', revenue: 4300, sessions: 15 },
  { date: 'Sep 8', revenue: 2200, sessions: 8 },
  { date: 'Sep 9', revenue: 2290, sessions: 9 },
  { date: 'Sep 10', revenue: 2000, sessions: 7 },
]

// Chart data for bookings
export const mockBookingsData = [
  { name: 'PC-01', bookings: 45 },
  { name: 'PC-02', bookings: 38 },
  { name: 'PC-03', bookings: 52 },
  { name: 'PC-04', bookings: 28 },
  { name: 'PC-05', bookings: 15 },
  { name: 'PC-06', bookings: 41 },
]

// Chart data for computer occupancy
export const mockOccupancyData = [
  { hour: '08:00', occupied: 15 },
  { hour: '10:00', occupied: 32 },
  { hour: '12:00', occupied: 48 },
  { hour: '14:00', occupied: 55 },
  { hour: '16:00', occupied: 62 },
  { hour: '18:00', occupied: 71 },
  { hour: '20:00', occupied: 68 },
  { hour: '22:00', occupied: 42 },
]

// Chart data for popular tariffs
export const mockTariffsData = [
  { name: 'Standard 2h', value: 245 },
  { name: 'Premium 3h', value: 189 },
  { name: 'Night Package', value: 156 },
  { name: 'Comfort 1h', value: 128 },
  { name: 'Morning Package', value: 67 },
]

// Helper function to get admin by ID
export function getAdminById(id: string): Administrator | undefined {
  return mockAdministrators.find((admin) => admin.id === id)
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return `${amount.toFixed(0)} сом`
}

// Helper function to format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
