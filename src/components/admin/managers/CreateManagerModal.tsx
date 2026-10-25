"use client";

import { useState } from "react";
import { ApiClientError } from "@/lib/api-client";
import { Button, ErrorNote, Modal } from "@/components/admin/ui";

interface CreateManagerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/** Создание менеджера: пароль обязателен, Telegram chat ID нужен для входа с кодом подтверждения. */
export function CreateManagerModal({ onClose, onSuccess }: CreateManagerModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", telegramChatId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiClientError(res.status, data?.error || "Ошибка создания менеджера", data?.code || "error");
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-sm">
      <span className="mb-1 block text-rn-muted">{label}</span>
      <input
        {...props}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2 text-white outline-none focus:border-rn-cyan"
      />
    </label>
  );

  return (
    <Modal open onClose={onClose} title="Новый менеджер">
      <form onSubmit={submit} className="space-y-3">
        {field("name", "Имя", { required: true, maxLength: 100 })}
        {field("phone", "Телефон", { required: true, type: "tel", placeholder: "+996 …" })}
        {field("email", "Email (логин для входа)", { required: true, type: "email" })}
        {field("password", "Пароль (не короче 8 символов)", { required: true, type: "password", minLength: 8, autoComplete: "new-password" })}
        {field("telegramChatId", "Telegram chat ID (для кода входа)", { inputMode: "numeric", placeholder: "например, 123456789" })}
        <p className="text-xs text-rn-muted">
          Без Telegram chat ID менеджер не сможет войти в production: код подтверждения приходит только в Telegram. Chat ID можно узнать скриптом
          get-telegram-chat-id.js после того, как менеджер напишет боту /start.
        </p>
        {error && <ErrorNote>{error}</ErrorNote>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Создать
          </Button>
        </div>
      </form>
    </Modal>
  );
}
