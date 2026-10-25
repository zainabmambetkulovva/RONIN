/**
 * Факты о клубе для AI-ассистента — только реальные данные из БД и конфигурации.
 * Ассистент не должен ничего придумывать о ценах, свободных местах или бронях.
 */
import { prisma } from "@/lib/prisma";
import { club } from "@/config/club";
import { BOOKING_HOLD_MINUTES } from "@/server/config";
import { findBusyComputerIds } from "@/server/services/availability";
import { bishkekMoment, bishkekShifted } from "@/server/time";

const pad = (n: number) => String(n).padStart(2, "0");

/** Время, о котором спрашивает пользователь: «в 20:00», «в 20», «завтра в 18:30». */
export function extractRequestedTime(text: string): { start: Date; label: string } | null {
  const lower = text.toLowerCase();
  const match = lower.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/) ?? lower.match(/(?:в|at|саат)\s*([01]?\d|2[0-3])\b(?![:.\d])/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = match[2] ? Number(match[2]) : 0;

  let dayOffset = /завтра|tomorrow|эртең/.test(lower) ? 1 : 0;
  let start = bishkekMoment(dayOffset, h, m);
  if (dayOffset === 0 && start.getTime() < Date.now() - 5 * 60_000) {
    dayOffset = 1;
    start = bishkekMoment(1, h, m);
  }
  return { start, label: `${dayOffset ? "завтра" : "сегодня"} в ${pad(h)}:${pad(m)} (время Бишкека)` };
}

async function freeByHall(start: Date, minutes: number) {
  const [categories, busy] = await Promise.all([
    prisma.computer_categories.findMany({
      where: { is_active: true },
      include: { computers: { select: { id: true, status: true } } },
    }),
    findBusyComputerIds(start, new Date(start.getTime() + minutes * 60_000)),
  ]);
  return categories
    .filter((c) => c.computers.length > 0)
    .map((c) => {
      const free = c.computers.filter((pc) => pc.status !== "maintenance" && !busy.has(pc.id)).length;
      return `- ${c.name}: свободно ${free} из ${c.computers.length}`;
    })
    .join("\n");
}

export async function buildClubFacts(lastUserMessage: string): Promise<string> {
  const tariffs = await prisma.tariffs.findMany({
    where: { is_active: true },
    include: { computer_categories: { select: { name: true } } },
    orderBy: [{ category_id: "asc" }, { price: "asc" }],
  });

  const byHall = new Map<string, string[]>();
  for (const t of tariffs) {
    const hall = t.computer_categories?.name ?? "Все залы";
    const h = Math.floor(t.duration_minutes / 60);
    const m = t.duration_minutes % 60;
    const duration = `${h ? `${h} ч` : ""}${m ? ` ${m} мин` : ""}`.trim();
    byHall.set(hall, [...(byHall.get(hall) ?? []), `${t.name} (${duration}) — ${Number(t.price)} сом`]);
  }
  const priceList = Array.from(byHall.entries())
    .map(([hall, items]) => `${hall}: ${items.join("; ")}`)
    .join("\n");

  const now = new Date();
  const nowLocal = bishkekShifted();
  const sections = [
    `Клуб: ${club.name}, киберспортивный клуб, ${club.city}.`,
    `Адрес: ${club.address.ru}, ${club.district.ru}. Телефон: ${club.phone.display}. Работаем круглосуточно.`,
    `Оплата в клубе: картой, наличными, переводом, по QR. Онлайн-оплата при бронировании на сайте — через Finik.`,
    `Текущее время в Бишкеке: ${pad(nowLocal.getUTCHours())}:${pad(nowLocal.getUTCMinutes())}.`,
    `Актуальный прайс (из базы):\n${priceList || "тарифы не заданы"}`,
    `Свободно прямо сейчас (на ближайший час):\n${await freeByHall(now, 60)}`,
  ];

  const requested = extractRequestedTime(lastUserMessage);
  if (requested) {
    sections.push(`Свободно ${requested.label} (на 1 час):\n${await freeByHall(requested.start, 60)}`);
  }

  sections.push(
    `Как забронировать: на сайте в разделе «Забронировать» (/booking) выбрать зал, тариф, время и свободный компьютер, затем оплатить. ` +
      `Неоплаченная бронь держит компьютер ${BOOKING_HOLD_MINUTES} минут; бронь подтверждается только после оплаты. ` +
      `Также можно забронировать и оплатить у администратора в клубе.`
  );

  return sections.join("\n\n");
}
