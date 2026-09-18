import type {
  User,
  Computer,
  ComputerCategory,
  Tariff,
  Booking,
  Payment,
  GamingSession,
  Notification,
  AiChat,
  AiMessage,
  Content,
  AuditLog,
} from "@prisma/client";

export type {
  User,
  Computer,
  ComputerCategory,
  Tariff,
  Booking,
  Payment,
  GamingSession,
  Notification,
  AiChat,
  AiMessage,
  Content,
  AuditLog,
};

export type ComputerWithCategory = Computer & {
  category: ComputerCategory;
};

export type ComputerWithStatus = ComputerWithCategory & {
  isPlaying: boolean;
};

export type TariffWithCategory = Tariff & {
  category: ComputerCategory | null;
};

export type BookingWithDetails = Booking & {
  user: Pick<User, "id" | "name" | "phone">;
  computer: Computer & { category: ComputerCategory };
  tariff: Tariff;
  payments: Payment[];
  gamingSessions: GamingSession[];
};

export type PaymentWithBooking = Payment & {
  booking: BookingWithDetails;
};

export type GamingSessionWithDetails = GamingSession & {
  booking: BookingWithDetails;
  computer: ComputerWithCategory;
  manager: Pick<User, "id" | "name">;
};

// API response types
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Booking flow
export interface BookingCreateInput {
  computerId: string;
  tariffId: string;
  startAt: string;
  paymentMethod: "electronic_wallet" | "cash";
}

// Stats for admin
export interface ClubStats {
  totalBookings: number;
  totalClients: number;
  paidBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  freeComputers: number;
  playingComputers: number;
  maintenanceComputers: number;
  popularComputers: Array<{ computer: Computer; bookingCount: number }>;
  popularTariffs: Array<{ tariff: Tariff; bookingCount: number }>;
}
