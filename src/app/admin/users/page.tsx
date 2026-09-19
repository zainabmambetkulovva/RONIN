import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersHeader } from "@/components/admin/users/UsersHeader";

export default async function UsersPage() {
  // TODO: Fetch from database with filters
  const users = [
    {
      id: "1",
      name: "Бекболот Алымкулов",
      email: "bekbolot@example.com",
      phone: "+996 555 123 456",
      role: "client",
      status: "active",
      createdAt: "2026-08-15",
      bookingsCount: 12,
    },
    {
      id: "2",
      name: "Айжан Кадырова",
      email: "aizhan@example.com",
      phone: "+996 700 234 567",
      role: "client",
      status: "active",
      createdAt: "2026-09-01",
      bookingsCount: 8,
    },
    {
      id: "3",
      name: "Нурбек Токтогулов",
      email: "nurbek@ronin.kg",
      phone: "+996 555 345 678",
      role: "manager",
      status: "active",
      createdAt: "2026-07-20",
      bookingsCount: 0,
    },
    {
      id: "4",
      name: "Эльмира Садыкова",
      email: "elmira@example.com",
      phone: "+996 777 456 789",
      role: "client",
      status: "blocked",
      createdAt: "2026-09-10",
      bookingsCount: 3,
    },
    {
      id: "5",
      name: "Азамат Момунов",
      email: "azamat@example.com",
      phone: "+996 500 567 890",
      role: "client",
      status: "active",
      createdAt: "2026-08-25",
      bookingsCount: 15,
    },
  ];

  const stats = {
    total: 156,
    active: 142,
    blocked: 8,
    managers: 6,
  };

  return (
    <div className="space-y-6">
      {/* Page header with stats */}
      <UsersHeader stats={stats} />

      {/* Users table */}
      <UsersTable users={users} />
    </div>
  );
}
