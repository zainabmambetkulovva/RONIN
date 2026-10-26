"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ApiClientError } from "@/lib/api-client";
import { BookingActions } from "./BookingActions";
import { NewBookingModal } from "./NewBookingModal";
import { Button } from "./ui";
import type { BookingDTO } from "@/types/api";

/** Работа на смене: найти бронь по 5-значному коду (оплата в клубе, старт/стоп сессии) и бронь для гостя. */
export function QuickDesk({ onChanged }: { onChanged?: () => void }) {
  const [code, setCode] = useState("");
  const [found, setFound] = useState<BookingDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = code.trim();
    if (!/^\d{5}$/.test(value)) {
      setError("Код брони — 5 цифр");
      return;
    }
    setSearching(true);
    setError(null);
    setFound(null);
    try {
      const { bookings } = await adminApi.bookings({ code: value });
      if (bookings[0]) setFound(bookings[0]);
      else setError("Бронь с таким кодом не найдена");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Ошибка поиска");
    } finally {
      setSearching(false);
    }
  };

  const refresh = async () => {
    onChanged?.();
    if (found) {
      const { bookings } = await adminApi.bookings({ code: found.bookingCode });
      setFound(bookings[0] ?? null);
    }
  };

  return (
    <section className="rounded-2xl border border-rn-line/80 bg-rn-surface/70 p-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <form onSubmit={search} className="flex flex-1 gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Код брони</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rn-muted" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              placeholder="Код брони клиента"
              className="w-full rounded-2xl border border-rn-line bg-rn-night py-3.5 pl-12 pr-4 font-display text-2xl tracking-[0.3em] text-white outline-none placeholder:font-sans placeholder:text-base placeholder:tracking-normal focus:border-rn-cyan"
            />
          </label>
          <Button type="submit" variant="primary" loading={searching} className="min-h-[56px] px-7">
            Найти
          </Button>
        </form>
        <Button variant="primary" className="min-h-[56px] px-7 text-base" onClick={() => setCreating(true)}>
          <Plus className="h-5 w-5" /> Бронь для гостя
        </Button>
      </div>
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      {found && (
        <div className="mt-5 border-t border-rn-line pt-5">
          <BookingActions booking={found} onChanged={refresh} />
        </div>
      )}
      <NewBookingModal open={creating} onClose={() => setCreating(false)} onCreated={() => onChanged?.()} />
    </section>
  );
}
