"use client";

import { useState } from "react";

export default function TestRegisterPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setResult("Регистрация...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: `test${Date.now()}@test.com`,
          password: "123456",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`✅ Успешно! User ID: ${data.user.id}`);
      } else {
        setResult(`❌ Ошибка: ${data.error} ${data.details || ""}`);
      }
    } catch (err: any) {
      setResult(`❌ Ошибка сети: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, background: "#03030a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>Тест регистрации</h1>
      
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          padding: "15px 30px",
          fontSize: 18,
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? "Регистрация..." : "Создать тестового пользователя"}
      </button>

      {result && (
        <div style={{
          marginTop: 20,
          padding: 20,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 10,
          whiteSpace: "pre-wrap",
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: 40, fontSize: 14, color: "#888" }}>
        <p>Эта страница создаст пользователя с случайным email</p>
        <p>После создания перейдите на /booking для теста оплаты</p>
      </div>
    </div>
  );
}
