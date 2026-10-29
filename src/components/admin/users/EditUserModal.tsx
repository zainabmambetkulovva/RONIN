"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { StyledSelect } from "@/components/ui/StyledSelect";

interface EditUserModalProps {
  user: { id: string; name: string; role: string; telegramChatId?: string | null };
  onClose: () => void;
  onSaved: () => void;
}

const field = { background: "rgba(15,15,30,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#fff" };

/** Роль, Telegram ID (код входа в панель) и новый пароль сотрудника. */
export function EditUserModal({ user, onClose, onSaved }: EditUserModalProps) {
  const [role, setRole] = useState(user.role);
  const [telegramChatId, setTelegramChatId] = useState(user.telegramChatId ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isStaff = role !== "client";

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password && password.length < 8) return setError("Пароль — не короче 8 символов");
    if (telegramChatId && !/^-?\d{4,20}$/.test(telegramChatId.trim())) return setError("Telegram ID — только цифры");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(role !== user.role && { role }),
          ...(isStaff && telegramChatId !== (user.telegramChatId ?? "") && { telegramChatId: telegramChatId.trim() }),
          ...(password && { password }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Не удалось сохранить");
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,3,10,0.9)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl p-8"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)", border: "1px solid rgba(139,92,246,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="truncate text-2xl font-black uppercase tracking-tight text-white">{user.name}</h2>
          <button onClick={onClose} aria-label="Закрыть" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <X className="h-5 w-5" style={{ color: "#ef4444" }} />
          </button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-white">Роль</label>
            <StyledSelect value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm font-medium" style={field}>
              <option value="client">Клиент</option>
              {user.role === "manager" && <option value="manager">Менеджер (старая роль)</option>}
              <option value="admin">Администратор</option>
            </StyledSelect>
          </div>
          {isStaff && (
            <div>
              <label className="mb-2 block text-sm font-bold text-white">Telegram ID</label>
              <input inputMode="numeric" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value.replace(/[^\d-]/g, ""))} placeholder="Например 123456789" className="w-full rounded-xl px-4 py-3 text-sm" style={field} />
              <p className="mt-1.5 text-xs text-gray-400">Сюда приходит код входа в панель. ID — у бота @userinfobot; в боте клуба нужно нажать «Start».</p>
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">Новый пароль</label>
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Оставьте пустым, чтобы не менять" className="w-full rounded-xl px-4 py-3 text-sm" style={field} />
          </div>
          {error && <div className="rounded-lg p-3 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:bg-white/5" style={{ border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
              Отмена
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              {loading ? "Сохранение…" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
