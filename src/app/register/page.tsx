import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Регистрация | RONIN",
  description: "Создайте аккаунт в RONIN",
};

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "#03030a",
      }}
    >
      {/* Background effects */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span
              className="text-4xl font-black tracking-widest"
              style={{
                background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 12px rgba(59,130,246,0.6))",
              }}
            >
              RONIN
            </span>
          </a>
          <p className="text-gray-400 mt-2">Создайте аккаунт и начните играть</p>
        </div>

        {/* Register form */}
        <RegisterForm />

        {/* Login link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Уже есть аккаунт?{" "}
            <a
              href="/login"
              className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Войти
            </a>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
