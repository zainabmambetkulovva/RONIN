import { ManagerDashboard } from "@/components/manager/ManagerDashboard";

export default async function ManagerPage() {
  return (
    <div className="min-h-screen" style={{ background: "#03030a" }}>
      <ManagerDashboard />
    </div>
  );
}
