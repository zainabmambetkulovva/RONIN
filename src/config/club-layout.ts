/**
 * Схема зала для 3D-карты: где стоит каждый ПК (метры, вид сверху).
 * x — слева направо, z — от дальней стены к входу. Игрок сидит лицом к дальней стене.
 * Зоны (залы, комнаты) задаёт администратор в «Настройки → Компьютеры»; номера ПК идут подряд
 * по зонам слева направо. Номер ПК связывает схему с компьютером в базе.
 */

export interface LayoutSlot {
  number: number;
  x: number;
  z: number;
  /** Поворот вокруг вертикали, радианы (0 — монитор у дальней стены). */
  rotation: number;
}

export interface LayoutZone {
  label: string;
  /** Прямоугольник зоны: левый-дальний угол и размеры. */
  x: number;
  z: number;
  width: number;
  depth: number;
}

export interface ClubLayout {
  slots: LayoutSlot[];
  zones: LayoutZone[];
  /** Перегородки посередине залов: отрезок по x на глубине z. */
  dividers: Array<{ x1: number; x2: number; z: number }>;
  width: number;
  depth: number;
}

/** Зона так, как её задаёт администратор. */
export interface ZoneConfig {
  label: string;
  /** Сколько ПК в зоне. */
  count: number;
  /** Сколько ПК в одном ряду. */
  columns: number;
  /** Зал (категория) в базе для новых ПК этой зоны. */
  categoryId?: string | null;
}

/** Расстановка по плану клуба RONIN: зал 1 — ПК 1–48, зал 2 — 49–96, отдельная комната — 97. */
export const DEFAULT_ZONES: ZoneConfig[] = [
  { label: "ЗАЛ 1", count: 48, columns: 8 },
  { label: "ЗАЛ 2", count: 48, columns: 8 },
  { label: "КОМНАТА", count: 1, columns: 1 },
];

const DESK_PITCH = 1.3; // шаг столов в ряду
const ROW_PITCH = 2.3; // шаг рядов (стол + кресло + проход)
const PADDING = 1.2;
const AISLE = 3.2; // проход между зонами

export function buildLayout(zones: ZoneConfig[]): ClubLayout {
  const valid = zones.filter((z) => z.count > 0 && z.columns > 0);
  const sizes = valid.map((z) => {
    const cols = Math.min(z.columns, z.count);
    const rows = Math.ceil(z.count / cols);
    return {
      cols,
      rows,
      width: (cols - 1) * DESK_PITCH + PADDING * 2,
      depth: (rows - 1) * ROW_PITCH + PADDING * 2 + 1,
    };
  });
  const maxDepth = Math.max(4, ...sizes.map((s) => s.depth));

  const slots: LayoutSlot[] = [];
  const out: LayoutZone[] = [];
  const dividers: ClubLayout["dividers"] = [];
  let x = 0;
  let number = 1;
  valid.forEach((zone, i) => {
    const size = sizes[i];
    // Небольшие комнаты прижаты к входу (ближняя сторона), большие залы — во всю глубину
    const z0 = maxDepth - size.depth;
    for (let k = 0; k < zone.count; k++) {
      const row = Math.floor(k / size.cols);
      const col = k % size.cols;
      slots.push({ number: number++, x: x + PADDING + col * DESK_PITCH, z: z0 + PADDING + row * ROW_PITCH, rotation: 0 });
    }
    out.push({ label: zone.label, x, z: z0, width: size.width, depth: size.depth });
    // Зал из 4+ рядов делится стенкой пополам (между креслами одного ряда и столами следующего)
    if (size.rows >= 4) {
      const r = Math.floor(size.rows / 2) - 1;
      dividers.push({ x1: x + 0.3, x2: x + size.width - 0.3, z: z0 + PADDING + r * ROW_PITCH + 1.65 });
    }
    x += size.width + AISLE;
  });

  return { slots, zones: out, dividers, width: Math.max(4, x - AISLE), depth: maxDepth };
}

/** Схема по умолчанию (пока администратор не менял настройки). */
export const CLUB_LAYOUT: ClubLayout = buildLayout(DEFAULT_ZONES);
