/**
 * Схема зала для 3D-карты: где стоит каждый ПК (метры, вид сверху).
 * x — слева направо, z — от дальней стены к входу. Игрок сидит лицом к дальней стене.
 * Расстановка — по плану клуба (зал 1: ПК 1–48, зал 2: ПК 49–96, отдельная комната: ПК 97).
 * Номер ПК связывает схему с компьютером в базе; меняется схема только здесь.
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

const COLS = 8;
const ROWS = 6;
const DESK_PITCH = 1.3; // шаг столов в ряду
const ROW_PITCH = 2.3; // шаг рядов (стол + кресло + проход)
const HALL_PADDING = 1.2;
const AISLE = 3.2; // проход между залами

const hallWidth = (COLS - 1) * DESK_PITCH + HALL_PADDING * 2;
const hallDepth = (ROWS - 1) * ROW_PITCH + HALL_PADDING * 2 + 1;

function hall(firstNumber: number, originX: number): LayoutSlot[] {
  const slots: LayoutSlot[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      slots.push({
        number: firstNumber + row * COLS + col,
        x: originX + HALL_PADDING + col * DESK_PITCH,
        z: HALL_PADDING + row * ROW_PITCH,
        rotation: 0,
      });
    }
  }
  return slots;
}

const hall2X = hallWidth + AISLE;
const roomX = hall2X + hallWidth + 1.2;
const roomDepth = 4;
const roomZ = hallDepth - roomDepth;

export const CLUB_LAYOUT: { slots: LayoutSlot[]; zones: LayoutZone[]; width: number; depth: number } = {
  slots: [
    ...hall(1, 0),
    ...hall(49, hall2X),
    // Отдельная комната справа у входа
    { number: 97, x: roomX + 1.6, z: roomZ + 1.6, rotation: 0 },
  ],
  zones: [
    { label: "ЗАЛ 1", x: 0, z: 0, width: hallWidth, depth: hallDepth },
    { label: "ЗАЛ 2", x: hall2X, z: 0, width: hallWidth, depth: hallDepth },
    { label: "КОМНАТА", x: roomX, z: roomZ, width: 3.2, depth: roomDepth },
  ],
  width: roomX + 3.2,
  depth: hallDepth,
};
