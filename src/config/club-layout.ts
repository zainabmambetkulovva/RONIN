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
  /** Вторая строка таблички, например «31 компьютер». */
  sublabel?: string;
  /** Прямоугольник зоны: левый-дальний угол и размеры. */
  x: number;
  z: number;
  width: number;
  depth: number;
  /** Где дверь: в боковой стене со стороны коридора или в передней стене. */
  door?: "left" | "right" | "front";
}

export interface ClubLayout {
  slots: LayoutSlot[];
  zones: LayoutZone[];
  /** Перегородки посередине залов: отрезок по x на глубине z. */
  dividers: Array<{ x1: number; x2: number; z: number }>;
  width: number;
  depth: number;
  /** Здание целиком (внешние стены) и коридор между залами со входом снизу. */
  building?: { x: number; z: number; width: number; depth: number };
  corridor?: { x: number; width: number };
  /** Проходы внутри залов (подсвечиваются на полу): прямоугольники x1..x2, z1..z2. */
  aisles?: Array<{ x1: number; z1: number; x2: number; z2: number }>;
}

/** Зал для схемы: название и реальные номера ПК (из базы или из настроек зон). */
export interface HallInput {
  label: string;
  numbers: number[];
  /** Сколько ПК в ряду (если не задано — подбирается само). */
  columns?: number;
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

/** Расстановка по плану клуба RONIN: зал 1 — ПК 1–48, зал 2 — 49–96, три отдельные комнаты — 97, 98, 99. */
export const DEFAULT_ZONES: ZoneConfig[] = [
  { label: "ЗАЛ 1", count: 48, columns: 8 },
  { label: "ЗАЛ 2", count: 48, columns: 8 },
  { label: "КОМНАТА 1", count: 1, columns: 1 },
  { label: "КОМНАТА 2", count: 1, columns: 1 },
  { label: "КОМНАТА 3", count: 1, columns: 1 },
];

const DESK_PITCH = 1.3; // ширина места за общим столом (столы блока стоят вплотную)
const ROW_PITCH = 2.7; // шаг рядов: стол + кресло + проход за креслами
const BACK_GAP = 1.0; // от задней стены до центра первого ряда столов
const FRONT_AISLE = 1.4; // проход у передней стены зала (от двери к рядам)
const SIDE_AISLE = 1.3; // проход вдоль стены с дверью
const WALL_GAP = 0.45; // от дальней боковой стены до крайнего места
const CENTER_AISLE = 1.4; // центральный проход между блоками столов
const CORRIDOR = 3.4; // коридор между левым и правым крылом
const STACK_GAP = 0.5; // стена между помещениями одно под другим
const ROOM_DEPTH = 3.6; // отдельная комната на 1 ПК
const ROOM_WING_SHARE = 0.38; // ширина комнаты — доля ширины крыла
/** Зал из стольких ПК или меньше — это отдельные комнаты по одному ПК. */
export const ROOM_MAX_PCS = 3;

const RU_PC = (n: number) => {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} компьютер`;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} компьютера`;
  return `${n} компьютеров`;
};

/** Залы из компьютеров базы: категория = зал, ПК по номерам; залы — по наименьшему номеру. */
export function hallsFromComputers(computers: Array<{ number: number; category: { name: string } }>): HallInput[] {
  const map = new Map<string, number[]>();
  for (const c of computers) {
    const list = map.get(c.category.name) ?? [];
    list.push(c.number);
    map.set(c.category.name, list);
  }
  return Array.from(map, ([label, numbers]) => ({ label: label.toUpperCase(), numbers: numbers.sort((a, b) => a - b) })).sort(
    (a, b) => a.numbers[0] - b.numbers[0]
  );
}

/** Зоны из настроек → залы с номерами подряд (схема, пока в базе нет компьютеров). */
export function hallsFromZones(zones: ZoneConfig[]): HallInput[] {
  let n = 1;
  return zones
    .filter((z) => z.count > 0 && z.columns > 0)
    .map((z) => ({ label: z.label, columns: z.columns, numbers: Array.from({ length: z.count }, () => n++) }));
}

interface Part {
  label: string;
  sublabel: string;
  numbers: number[];
  /** Сколько мест в ряду в каждом блоке (между блоками — центральный проход). */
  blocks: number[];
  rows: number;
  width: number;
  depth: number;
  dz: number;
}

interface Unit {
  /** Столбик отдельных комнат — растягивается на ширину крыла. */
  rooms?: boolean;
  width: number;
  depth: number;
  /** Помещения внутри блока (у комнат — несколько, одна под другой). */
  parts: Part[];
}

const blocksWidth = (blocks: number[]) => blocks.reduce((s, b) => s + b * DESK_PITCH, 0) + (blocks.length - 1) * CENTER_AISLE;

/**
 * Схема как в настоящем клубе: левое и правое крыло, между ними коридор со входом снизу.
 * В зале ряды общих столов разделены центральным проходом, вдоль стены с дверью и у передней стены — проходы,
 * между рядами — место пройти за креслами. Маленькие залы — отдельные комнаты по одному ПК, столбиком у входа.
 */
export function buildLayoutFromHalls(halls: HallInput[], sublabel: (count: number) => string = RU_PC): ClubLayout {
  const units: Unit[] = [];
  const rooms: Part[] = [];
  let roomNo = 1;
  for (const hall of halls.filter((h) => h.numbers.length > 0)) {
    if (hall.numbers.length <= ROOM_MAX_PCS && halls.length > 1) {
      for (const num of hall.numbers) {
        rooms.push({ label: `КОМНАТА ${roomNo++}`, sublabel: sublabel(1), numbers: [num], blocks: [1], rows: 1, width: 0, depth: ROOM_DEPTH, dz: 0 });
      }
      continue;
    }
    const count = hall.numbers.length;
    const cols = Math.min(count, hall.columns ?? Math.max(4, Math.min(12, Math.ceil(Math.sqrt(count * 2.2)))));
    const rows = Math.ceil(count / cols);
    const blocks = cols >= 6 ? [Math.ceil(cols / 2), cols - Math.ceil(cols / 2)] : [cols];
    const width = SIDE_AISLE + blocksWidth(blocks) + WALL_GAP;
    const depth = BACK_GAP + (rows - 1) * ROW_PITCH + 1.2 + FRONT_AISLE;
    units.push({ width, depth, parts: [{ label: hall.label, sublabel: sublabel(count), numbers: hall.numbers, blocks, rows, width, depth, dz: 0 }] });
  }
  if (rooms.length) {
    let dz = 0;
    for (const r of rooms) {
      r.width = SIDE_AISLE + DESK_PITCH + 1.2;
      r.dz = dz;
      dz += r.depth + STACK_GAP;
    }
    units.push({ rooms: true, width: rooms[0].width, depth: dz - STACK_GAP, parts: rooms });
  }

  // Крылья: каждый блок — в крыло, где сейчас меньше глубина (комнаты идут последними — у входа)
  const wings: Unit[][] = [[], []];
  const wingDepth = [0, 0];
  for (const u of units) {
    const w = wingDepth[0] <= wingDepth[1] ? 0 : 1;
    wings[w].push(u);
    wingDepth[w] += u.depth + (wings[w].length > 1 ? STACK_GAP : 0);
  }
  const leftW = Math.max(0, ...wings[0].map((u) => u.width));
  const rightW = Math.max(0, ...wings[1].map((u) => u.width));
  // Комнаты — у коридора, шириной примерно в треть крыла (по плану клуба), не на всё крыло
  wings.forEach((wing, side) => {
    const wingW = side === 0 ? leftW : rightW;
    for (const u of wing) {
      if (!u.rooms) continue;
      u.width = Math.min(wingW, Math.max(u.width, wingW * ROOM_WING_SHARE));
      for (const part of u.parts) part.width = u.width;
    }
  });
  const depth = Math.max(4, ...wingDepth);
  const corridorX = leftW;
  const width = leftW + CORRIDOR + rightW;

  const slots: LayoutSlot[] = [];
  const zones: LayoutZone[] = [];
  const dividers: ClubLayout["dividers"] = [];
  const aisles: NonNullable<ClubLayout["aisles"]> = [];
  wings.forEach((wing, side) => {
    let z = 0;
    wing.forEach((u, i) => {
      // Последний блок крыла прижат ко входу (низ схемы)
      const z0 = i === wing.length - 1 && wing.length > 1 ? depth - u.depth : z;
      const x0 = side === 0 ? leftW - u.width : leftW + CORRIDOR;
      for (const part of u.parts) {
        const pz = z0 + part.dz;
        const fz = pz + part.depth;
        // Дверь — в стене со стороны коридора: у левого крыла справа, у правого — слева
        const door = side === 0 ? "right" : "left";
        zones.push({ label: part.label, sublabel: part.sublabel, x: x0, z: pz, width: part.width, depth: part.depth, door });

        const desksW = blocksWidth(part.blocks);
        // Места прижаты к дальней стене, проход — у стены с дверью
        const startX = door === "left" ? x0 + part.width - WALL_GAP - desksW : x0 + WALL_GAP;
        const roomCenter = part.numbers.length === 1 && part.rows === 1;
        const blockStarts: number[] = [];
        let bx = roomCenter ? x0 + (door === "left" ? SIDE_AISLE : 0) + (part.width - SIDE_AISLE - DESK_PITCH) / 2 : startX;
        for (const b of part.blocks) {
          blockStarts.push(bx);
          bx += b * DESK_PITCH + CENTER_AISLE;
        }
        const perRow = part.blocks.reduce((s, b) => s + b, 0);
        part.numbers.forEach((num, k) => {
          const row = Math.floor(k / perRow);
          let col = k % perRow;
          let block = 0;
          while (col >= part.blocks[block]) col -= part.blocks[block++];
          slots.push({ number: num, x: blockStarts[block] + DESK_PITCH / 2 + col * DESK_PITCH, z: pz + BACK_GAP + row * ROW_PITCH, rotation: 0 });
        });

        // Проходы на полу: вдоль стены с двери, у передней стены, центральный
        const sideX = door === "left" ? [x0, x0 + SIDE_AISLE - 0.15] : [x0 + part.width - SIDE_AISLE + 0.15, x0 + part.width];
        aisles.push({ x1: sideX[0] + 0.08, z1: pz + 0.15, x2: sideX[1] - 0.08, z2: fz - 0.1 });
        if (!roomCenter) {
          aisles.push({ x1: x0 + 0.1, z1: fz - FRONT_AISLE + 0.15, x2: x0 + part.width - 0.1, z2: fz - 0.1 });
          if (part.blocks.length > 1) {
            const cx1 = blockStarts[0] + part.blocks[0] * DESK_PITCH;
            aisles.push({ x1: cx1 + 0.15, z1: pz + 0.15, x2: cx1 + CENTER_AISLE - 0.15, z2: fz - FRONT_AISLE + 0.15 });
          }
        }
        // Большой зал (6+ рядов) делится стенкой пополам — отдельно над каждым блоком, проходы свободны
        if (part.rows >= 6) {
          const r = Math.floor(part.rows / 2) - 1;
          const dz = pz + BACK_GAP + r * ROW_PITCH + 1.65;
          part.blocks.forEach((b, bi) => dividers.push({ x1: blockStarts[bi] - 0.1, x2: blockStarts[bi] + b * DESK_PITCH + 0.1, z: dz }));
        }
      }
      z = z0 + u.depth + STACK_GAP;
    });
  });

  return {
    slots,
    zones,
    dividers,
    aisles,
    width,
    depth,
    building: { x: -0.6, z: -0.6, width: width + 1.2, depth: depth + 1.2 },
    corridor: { x: corridorX, width: CORRIDOR },
  };
}

/** Схема из зон настроек (номера ПК подряд). */
export function buildLayout(zones: ZoneConfig[]): ClubLayout {
  return buildLayoutFromHalls(hallsFromZones(zones));
}

/** Схема по умолчанию (пока администратор не менял настройки). */
export const CLUB_LAYOUT: ClubLayout = buildLayout(DEFAULT_ZONES);
