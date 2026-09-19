import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

// TODO: Replace with real auth check via NextAuth
async function getCurrentUser() {
  // Temporary mock - replace with: await getServerSession(authOptions)
  return {
    id: "1",
    name: "Admin User",
    email: "admin@ronin.kg",
    role: "admin" as const,
    image: null,
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Защита: только admin и manager
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen text-white" style={{ background: "#03030a" }}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar user={user} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader user={user} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1600px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
