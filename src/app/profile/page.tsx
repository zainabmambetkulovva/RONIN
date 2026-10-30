"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2, LogOut, Mail, Phone, CalendarDays, CalendarClock, Pencil } from "lucide-react";
import { CabinetShell, PageTitle, Panel } from "@/components/cabinet/CabinetShell";
import { UserAvatar } from "@/components/cabinet/UserAvatar";
import { bookingView } from "@/components/cabinet/BookingStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { signOut } from "@/hooks/useSession";
import { api, ApiClientError } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import type { AvatarDTO, BookingDTO, CurrentUserDTO } from "@/types/api";
import { normalizeKgPhone } from "@/lib/phone";

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<CurrentUserDTO | null>(null);
  const [avatars, setAvatars] = useState<AvatarDTO[]>([]);
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  // Успех храним ключом перевода — текст меняется вместе с языком сайта
  const [message, setMessage] = useState<{ ok: boolean; text?: string; key?: string } | null>(null);

  useEffect(() => {
    api.me().then(({ user }) => {
      setUser(user);
      setForm({ name: user.name, phone: user.phone ?? "", avatar: user.avatar ?? "" });
    });
    api.avatars().then((r) => setAvatars(r.avatars)).catch(() => setAvatars([]));
    api.myBookings().then((r) => setBookings(r.bookings)).catch(() => setBookings([]));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (form.name.trim().length < 2) return setMessage({ ok: false, key: "cab.profile.nameInvalid" });
    if (form.phone.trim() && !normalizeKgPhone(form.phone)) return setMessage({ ok: false, key: "cab.profile.phoneInvalid" });
    setSaving(true);
    try {
      const phone = form.phone.trim() ? normalizeKgPhone(form.phone)! : "";
      const { user } = await api.updateProfile({ name: form.name.trim(), phone, avatar: form.avatar });
      setUser(user);
      setEditing(false);
      setMessage({ ok: true, key: "cab.profile.saved" });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof ApiClientError ? err.message : t("cab.book.errorGeneric") });
    } finally {
      setSaving(false);
    }
  };

  const upcoming = bookings.filter((b) => ["confirmed", "awaiting_payment", "payment_failed"].includes(bookingView(b))).length;
  const visits = bookings.filter((b) => ["completed", "active"].includes(bookingView(b))).length;

  return (
    <CabinetShell>
      <PageTitle eyebrow={t("cab.profile.eyebrow")} title={t("cab.profile.title")} />

      {!user && (
        <div className="flex items-center gap-3 text-rn-muted">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("cab.receipt.loading")}
        </div>
      )}

      {user && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Panel>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <UserAvatar name={user.name} avatarCode={editing ? form.avatar : user.avatar} image={user.image} avatars={avatars} size={88} />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-2xl font-bold">{user.name}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-rn-muted">
                  <CalendarDays className="h-4 w-4" /> {t("cab.profile.since")} {formatDate(user.createdAt, language, { year: "numeric" })}
                </p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 self-start rounded-xl border border-rn-line px-4 py-2 text-sm font-semibold hover:border-rn-violet">
                  <Pencil className="h-4 w-4" /> {t("cab.profile.edit")}
                </button>
              )}
            </div>

            {!editing ? (
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <Field icon={<Mail className="h-4 w-4" />} label="Email" value={user.email ?? "—"} />
                <Field icon={<Phone className="h-4 w-4" />} label={t("cab.profile.phone")} value={user.phone ?? t("cab.profile.notSet")} />
              </dl>
            ) : (
              <form onSubmit={save} className="mt-8 space-y-5">
                <Input label={t("cab.profile.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required maxLength={100} />
                <Input label={t("cab.profile.phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" placeholder="+996 …" maxLength={20} />
                {avatars.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-rn-muted">{t("cab.profile.avatar")}</p>
                    <div className="flex flex-wrap gap-3">
                      {avatars.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setForm({ ...form, avatar: a.code })}
                          aria-pressed={form.avatar === a.code}
                          className={`rounded-full p-0.5 transition ${form.avatar === a.code ? "ring-2 ring-rn-magenta" : "opacity-70 hover:opacity-100"}`}
                        >
                          <UserAvatar name={user.name} avatarCode={a.code} avatars={avatars} size={52} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-rn-muted">{t("cab.profile.emailNote")}</p>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rn-magenta to-rn-violet px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {t("cab.profile.save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setForm({ name: user.name, phone: user.phone ?? "", avatar: user.avatar ?? "" });
                    }}
                    className="rounded-xl border border-rn-line px-5 py-2.5 text-sm font-semibold text-rn-muted hover:text-white"
                  >
                    {t("cab.profile.cancel")}
                  </button>
                </div>
              </form>
            )}
            {message && <p className={`mt-4 text-sm ${message.ok ? "text-emerald-300" : "text-rn-pink"}`}>{message.key ? t(message.key) : message.text}</p>}
          </Panel>

          <div className="space-y-6">
            <Panel>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Stat value={upcoming} label={t("cab.profile.upcoming")} />
                <Stat value={visits} label={t("cab.profile.visits")} />
              </div>
              <Link href="/bookings" className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-rn-line py-3 text-sm font-semibold hover:border-rn-violet">
                <CalendarClock className="h-4 w-4" /> {t("cab.nav.bookings")}
              </Link>
            </Panel>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rn-pink/30 py-3 text-sm font-semibold text-rn-pink transition hover:bg-rn-pink/10"
            >
              <LogOut className="h-4 w-4" /> {t("cab.profile.logout")}
            </button>
          </div>
        </div>
      )}
    </CabinetShell>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-rn-muted">
        {icon} {label}
      </dt>
      <dd className="mt-1 break-all font-semibold text-white">{value}</dd>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4">
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-rn-muted">{label}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  ...rest
}: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-rn-muted">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-rn-line bg-rn-night px-4 py-3 text-white outline-none transition focus:border-rn-cyan"
      />
    </label>
  );
}
