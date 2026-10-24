import { NextRequest, NextResponse } from "next/server";
import { UserRole, UserStatus, BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withAdminProtection } from "@/lib/with-admin-protection";



// GET /api/admin/stats - общая статистика для админ панели
export async function GET(req: NextRequest) {
  // Protect admin endpoint
  const adminCheck = await withAdminProtection(req);
  if (adminCheck.error) return adminCheck.response;

  try {
    // Даты для вычислений
    const now = new Date();
    
    // Сегодняшняя дата (начало и конец дня)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    // Завтра (для upcoming bookings - следующие 24 часа)
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Количество клиентов
    const totalClients = await prisma.users.count({
      where: { role: UserRole.client },
    });

    // Количество активных клиентов
    const activeClients = await prisma.users.count({
      where: {
        role: UserRole.client,
        status: UserStatus.active,
      },
    });

    // Клиенты зарегистрированные сегодня
    const todayClients = await prisma.users.count({
      where: {
        role: UserRole.client,
        created_at: {
          gte: today,
          lt: todayEnd,
        },
      },
    });

    // Количество менеджеров
    const totalManagers = await prisma.users.count({
      where: { role: UserRole.manager },
    });

    // Количество активных менеджеров
    const activeManagers = await prisma.users.count({
      where: {
        role: UserRole.manager,
        status: UserStatus.active,
      },
    });

    // Количество неактивных менеджеров
    const inactiveManagers = totalManagers - activeManagers;

    // Всего бронирований
    const totalBookings = await prisma.bookings.count();

    // Активные бронирования (подтвержденные и идут сейчас)
    const activeBookings = await prisma.bookings.count({
      where: {
        status: BookingStatus.confirmed,
        start_at: {
          lte: now,
        },
        end_at: {
          gte: now,
        },
      },
    });

    // Бронирования на сегодня
    const todayBookings = await prisma.bookings.count({
      where: {
        start_at: {
          gte: today,
          lt: todayEnd,
        },
      },
    });

    // Завершенные бронирования
    const completedBookings = await prisma.bookings.count({
      where: { status: BookingStatus.completed },
    });

    // Отмененные бронирования
    const cancelledBookings = await prisma.bookings.count({
      where: { status: BookingStatus.cancelled },
    });

    // Компьютеры
    const totalComputers = await prisma.computers.count();
    const availableComputers = await prisma.computers.count({
      where: { status: "available" },
    });

    // Тарифы
    const totalTariffs = await prisma.tariffs.count();
    const activeTariffs = await prisma.tariffs.count({
      where: { is_active: true },
    });

    // Ближайшие бронирования (следующие 24 часа от текущего момента)
    const upcomingBookings = await prisma.bookings.findMany({
      where: {
        status: BookingStatus.confirmed,
        start_at: {
          gte: now,
          lte: next24Hours,
        },
      },
      include: {
        users: {
          select: {
            name: true,
          },
        },
        computers: {
          select: {
            number: true,
            computer_categories: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        start_at: "asc",
      },
      take: 10,
    });

    // Последние регистрации (5 пользователей)
    const recentUsers = await prisma.users.findMany({
      where: { role: UserRole.client },
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        created_at: true,
      },
    });

    // Transform data for frontend (snake_case → camelCase)
    const transformedUpcomingBookings = upcomingBookings.map((booking) => ({
      id: booking.id,
      bookingNumber: booking.booking_number,
      startAt: booking.start_at,
      endAt: booking.end_at,
      status: booking.status,
      user: {
        name: booking.users.name,
      },
      computer: {
        number: booking.computers.number,
        category: {
          name: booking.computers.computer_categories.name,
        },
      },
    }));

    const transformedRecentUsers = recentUsers.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      createdAt: user.created_at,
    }));

    return NextResponse.json({
      clients: {
        total: totalClients,
        active: activeClients,
        today: todayClients,
      },
      managers: {
        total: totalManagers,
        active: activeManagers,
        inactive: inactiveManagers,
      },
      bookings: {
        total: totalBookings,
        active: activeBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        today: todayBookings,
      },
      computers: {
        total: totalComputers,
        available: availableComputers,
        occupied: totalComputers - availableComputers,
      },
      tariffs: {
        total: totalTariffs,
        active: activeTariffs,
      },
      upcomingBookings: transformedUpcomingBookings,
      recentUsers: transformedRecentUsers,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
