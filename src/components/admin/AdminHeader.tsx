"use client";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header
      className="h-16 border-b flex items-center px-6"
      style={{
        background: "rgba(5,5,15,0.85)",
        borderColor: "rgba(59,130,246,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left - Page title будет добавлен позже */}
      <div className="flex-1">
        <h2 className="text-lg font-bold text-white">Админ панель RONIN</h2>
      </div>

      {/* Right - User info */}
      <div className="text-right">
        <p className="text-xs text-gray-400">Welcome back!</p>
        <p className="text-sm font-bold text-white">{user.name}</p>
      </div>
    </header>
  );
}
