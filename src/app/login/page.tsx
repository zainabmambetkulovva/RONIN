"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
          <a href="/" className="inline-flex flex-col items-center gap-2">
            <div className="relative w-20 h-20">
              <Image
                src="/logo-new.png"
                alt="RONIN Logo"
                fill
                className="object-contain"
                sizes="80px"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(139,92,246,0.8))",
                }}
              />
            </div>
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
          <p className="text-gray-400 mt-2">{t("auth.loginSubtitle")}</p>
        </div>

        {/* Login form */}
        <LoginForm />

        {/* Register link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            {t("auth.noAccount")}{" "}
            <a
              href="/register"
              className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t("auth.registerLink")}
            </a>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← {t("auth.backHome")}
          </a>
        </div>
      </div>
    </div>
  );
}
