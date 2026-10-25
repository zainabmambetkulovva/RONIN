"use client";

import { useEffect } from "react";
import { CalendarClock, MonitorCheck, MonitorX, Timer, Wrench } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { IconStat, useLoader } from "./ui";

/** Сводка «клуб сейчас» для верха рабочих разделов: только реальные цифры, обновляется раз в минуту. */
export function ClubPulse() {
  const { data, reload } = useLoader(() => adminApi.stats("today").then((r) => r.stats), []);

  useEffect(() => {
    const id = setInterval(reload, 60_000);
    return () => clearInterval(id);
  }, [reload]);

  const v = (n: number | undefined) => (data ? n : "—");

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <IconStat icon={<MonitorCheck className="h-5 w-5" />} color="bg-emerald-500" value={v(data?.computers.available)} label="Свободно ПК" />
      <IconStat icon={<MonitorX className="h-5 w-5" />} color="bg-rose-500" value={v(data?.computers.occupied)} label="Занято ПК" />
      <IconStat icon={<Wrench className="h-5 w-5" />} color="bg-zinc-500" value={v(data?.computers.maintenance)} label="На обслуживании" />
      <IconStat icon={<Timer className="h-5 w-5" />} color="bg-rn-electric" value={v(data?.sessions.active)} label="Играют сейчас" />
      <IconStat icon={<CalendarClock className="h-5 w-5" />} color="bg-rn-magenta" value={v(data?.bookings.awaitingPayment)} label="Ждут оплаты" />
    </div>
  );
}
