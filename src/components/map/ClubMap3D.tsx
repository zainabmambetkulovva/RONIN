"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ClubLayout } from "@/config/club-layout";
import { useBranding } from "@/contexts/BrandingContext";

export type SeatState = "free" | "busy" | "maintenance" | "unknown";

export interface SeatView {
  number: number;
  state: SeatState;
}

interface ClubMap3DProps {
  layout: ClubLayout;
  seats: SeatView[];
  selected: number | null;
  onSelect: (number: number) => void;
}

const STATE_COLOR: Record<SeatState, number> = {
  free: 0x22c55e,
  busy: 0xef4444,
  maintenance: 0x71717a,
  unknown: 0x3f3f5a,
};

/** Подпись номера ПК — спрайт с текстом на canvas. */
function makeLabel(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 44px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(168,85,247,0.9)";
  ctx.shadowBlur = 10;
  ctx.fillText(text, 64, 34);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(0.7, 0.35, 1);
  return sprite;
}

/** Табличка на стене: название зала и вторая строка (сколько ПК), неоновый текст на тёмной панели. */
function makeSign(title: string, subtitle: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 204;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(8,6,24,0.92)";
  ctx.fillRect(0, 0, 640, 204);
  ctx.strokeStyle = "rgba(139,92,246,0.9)";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 634, 198);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(168,85,247,0.95)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#ffffff";
  let size = 78;
  ctx.font = `bold ${size}px Inter, Arial, sans-serif`;
  while (ctx.measureText(title).width > 590 && size > 30) ctx.font = `bold ${(size -= 4)}px Inter, Arial, sans-serif`;
  ctx.fillText(title, 320, subtitle ? 78 : 102);
  if (subtitle) {
    ctx.shadowBlur = 8;
    ctx.fillStyle = "rgba(196,181,253,0.95)";
    ctx.font = "600 44px Inter, Arial, sans-serif";
    ctx.fillText(subtitle, 320, 150);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }));
}

/** Коврик у входа с названием клуба. */
function makeMat(name: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0d0b22";
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = "rgba(139,92,246,0.7)";
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 492, 236);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(139,92,246,0.9)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "rgba(196,181,253,0.95)";
  ctx.font = "bold 80px Inter, Arial, sans-serif";
  ctx.fillText(name.toUpperCase().slice(0, 12), 256, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: texture }));
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/**
 * 3D-зал на three.js: столы, кресла и мониторы — InstancedMesh (мало вызовов отрисовки, быстро на телефоне),
 * цвет экрана и подсветки пола — состояние ПК. Вращение/масштаб пальцем или мышью, выбор ПК — касанием.
 */
export default function ClubMap3D({ layout, seats, selected, onSelect }: ClubMap3DProps) {
  const brandName = useBranding().clubName;
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ setStates: (s: SeatView[]) => void; setSelected: (n: number | null) => void } | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const host = hostRef.current!;
    const CLUB_LAYOUT = layout;
    const slots = CLUB_LAYOUT.slots;
    const cx = CLUB_LAYOUT.width / 2;
    const cz = CLUB_LAYOUT.depth / 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07061a, 45, 110);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(cx, 24, cz + 22);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(cx, 0, cz);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 8;
    controls.maxDistance = 60;
    controls.maxPolarAngle = Math.PI * 0.42;
    controls.minPolarAngle = Math.PI * 0.08;
    controls.screenSpacePanning = false;
    controls.update();

    // Свет
    scene.add(new THREE.AmbientLight(0x8b7cff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(cx - 10, 20, cz + 10);
    scene.add(key);
    const rim = new THREE.PointLight(0xd946ef, 40, 40);
    rim.position.set(cx, 6, -2);
    scene.add(rim);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    // Пол и зоны
    const floor = new THREE.Mesh(
      track(new THREE.PlaneGeometry(CLUB_LAYOUT.width + 80, CLUB_LAYOUT.depth + 80)),
      track(new THREE.MeshStandardMaterial({ color: 0x0b0920, roughness: 0.9, metalness: 0.05 }))
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0, cz);
    scene.add(floor);

    // Помещения как в настоящем клубе: пол-ковёр с плиткой, высокие задняя и боковые стены с неоновой полосой,
    // дверь — в стене со стороны коридора; передняя стена низкая (разрез), чтобы было видно, что внутри
    const WALL_H = 2.4;
    const WALL_T = 0.14;
    const FRONT_H = 0.9;
    const DOOR = 1.2;
    const carpetMat = track(new THREE.MeshStandardMaterial({ color: 0x141033, roughness: 0.95, metalness: 0 }));
    const wallMat = track(new THREE.MeshStandardMaterial({ color: 0x1d1745, roughness: 0.8, metalness: 0.1 }));
    const wallTopMat = track(new THREE.MeshStandardMaterial({ color: 0x2a2260, roughness: 0.6 }));
    const zoneNeonMat = track(new THREE.MeshBasicMaterial({ color: 0x8b5cf6, toneMapped: false }));
    const blueNeonMat = track(new THREE.MeshBasicMaterial({ color: 0x3b82f6, toneMapped: false }));
    const baseNeonMat = track(new THREE.MeshBasicMaterial({ color: 0xd946ef, toneMapped: false, transparent: true, opacity: 0.7 }));
    const tileMat = track(new THREE.LineBasicMaterial({ color: 0x2a2260, transparent: true, opacity: 0.45 }));
    const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) => {
      if (w <= 0.001 || h <= 0.001 || d <= 0.001) return null;
      const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return mesh;
    };
    const tiles = (x0: number, z0: number, w: number, d: number, mat: THREE.LineBasicMaterial) => {
      const pts: number[] = [];
      for (let tx = x0 + 1; tx < x0 + w - 0.01; tx += 1) pts.push(tx, 0.008, z0, tx, 0.008, z0 + d);
      for (let tz = z0 + 1; tz < z0 + d - 0.01; tz += 1) pts.push(x0, 0.008, tz, x0 + w, 0.008, tz);
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      scene.add(new THREE.LineSegments(geo, mat));
    };
    // Боковая стена по z от a до b; с дверным проёмом у передней части, если door
    const sideWall = (x: number, za: number, zb: number, door: boolean) => {
      if (!door) {
        box(WALL_T, WALL_H, zb - za, wallMat, x, WALL_H / 2, (za + zb) / 2);
        box(WALL_T + 0.02, 0.03, zb - za, wallTopMat, x, WALL_H + 0.015, (za + zb) / 2);
        return;
      }
      const d1 = Math.max(za + 0.3, zb - 0.5 - DOOR);
      const d2 = d1 + DOOR;
      box(WALL_T, WALL_H, d1 - za, wallMat, x, WALL_H / 2, (za + d1) / 2);
      box(WALL_T, WALL_H, zb - d2, wallMat, x, WALL_H / 2, (d2 + zb) / 2);
      box(WALL_T, WALL_H - 2.1, DOOR, wallMat, x, 2.1 + (WALL_H - 2.1) / 2, (d1 + d2) / 2);
      box(WALL_T + 0.04, 2.1, 0.07, wallTopMat, x, 1.05, d1);
      box(WALL_T + 0.04, 2.1, 0.07, wallTopMat, x, 1.05, d2);
      box(0.03, 0.03, DOOR - 0.1, zoneNeonMat, x, 2.06, (d1 + d2) / 2);
      box(WALL_T + 0.02, 0.03, zb - za, wallTopMat, x, WALL_H + 0.015, (za + zb) / 2);
    };

    for (const zone of CLUB_LAYOUT.zones) {
      const { x: zx, z: zz, width: zw, depth: zd } = zone;
      const mx = zx + zw / 2;
      const mz = zz + zd / 2;
      const fz = zz + zd;
      const door = zone.door ?? "front";

      const carpet = new THREE.Mesh(track(new THREE.PlaneGeometry(zw, zd)), carpetMat);
      carpet.rotation.x = -Math.PI / 2;
      carpet.position.set(mx, 0.005, mz);
      scene.add(carpet);
      tiles(zx, zz, zw, zd, tileMat);

      // Задняя стена, неон по верху и подсветка плинтуса
      box(zw + WALL_T, WALL_H, WALL_T, wallMat, mx, WALL_H / 2, zz);
      box(zw + WALL_T, 0.03, WALL_T + 0.02, wallTopMat, mx, WALL_H + 0.015, zz);
      box(zw - 0.1, 0.05, 0.03, zoneNeonMat, mx, WALL_H - 0.25, zz + WALL_T / 2 + 0.02);
      box(zw - 0.1, 0.03, 0.02, baseNeonMat, mx, 0.05, zz + WALL_T / 2 + 0.015);
      // Боковые стены (дверь — со стороны коридора)
      sideWall(zx, zz, fz, door === "left");
      sideWall(zx + zw, zz, fz, door === "right");
      // Вертикальные неоновые полосы в углах у задней стены
      box(0.04, WALL_H - 0.4, 0.04, blueNeonMat, zx + WALL_T / 2 + 0.03, WALL_H / 2, zz + 0.35);
      box(0.04, WALL_H - 0.4, 0.04, blueNeonMat, zx + zw - WALL_T / 2 - 0.03, WALL_H / 2, zz + 0.35);

      // Передняя стена — низкая (разрез); дверь в ней только если зал не у коридора
      if (door === "front") {
        const dw = Math.min(DOOR, zw - 0.6);
        const seg = (zw - dw) / 2;
        box(seg, FRONT_H, WALL_T, wallMat, zx + seg / 2, FRONT_H / 2, fz);
        box(seg, FRONT_H, WALL_T, wallMat, zx + zw - seg / 2, FRONT_H / 2, fz);
        box(seg, 0.03, WALL_T + 0.02, zoneNeonMat, zx + seg / 2, FRONT_H + 0.015, fz);
        box(seg, 0.03, WALL_T + 0.02, zoneNeonMat, zx + zw - seg / 2, FRONT_H + 0.015, fz);
      } else {
        box(zw + WALL_T, FRONT_H, WALL_T, wallMat, mx, FRONT_H / 2, fz);
        box(zw, 0.03, WALL_T + 0.02, zoneNeonMat, mx, FRONT_H + 0.015, fz);
      }

      // Табличка на задней стене: название и сколько компьютеров
      const sign = makeSign(zone.label, zone.sublabel ?? "");
      track(sign.geometry);
      track(sign.material as THREE.Material);
      const sw = Math.min(zw * 0.62, 3.6);
      sign.scale.set(sw, sw * 0.32, 1);
      sign.position.set(mx, WALL_H - 0.55 - sw * 0.16, zz + WALL_T / 2 + 0.012);
      scene.add(sign);
    }

    // Здание: внешние стены (спереди — низкая, со входом в коридор), коридор и коврик у входа
    if (CLUB_LAYOUT.building) {
      const b = CLUB_LAYOUT.building;
      const OUT_H = 2.8;
      const OUT_T = 0.3;
      const outerMat = track(new THREE.MeshStandardMaterial({ color: 0x15122e, roughness: 0.85, metalness: 0.15 }));
      const bx2 = b.x + b.width;
      const bz2 = b.z + b.depth;
      box(b.width + OUT_T, OUT_H, OUT_T, outerMat, b.x + b.width / 2, OUT_H / 2, b.z);
      box(OUT_T, OUT_H, b.depth, outerMat, b.x, OUT_H / 2, b.z + b.depth / 2);
      box(OUT_T, OUT_H, b.depth, outerMat, bx2, OUT_H / 2, b.z + b.depth / 2);
      box(b.width, 0.04, 0.05, blueNeonMat, b.x + b.width / 2, OUT_H - 0.3, b.z + OUT_T / 2 + 0.03);
      box(0.05, 0.04, b.depth, blueNeonMat, b.x + OUT_T / 2 + 0.03, OUT_H - 0.3, b.z + b.depth / 2);
      box(0.05, 0.04, b.depth, blueNeonMat, bx2 - OUT_T / 2 - 0.03, OUT_H - 0.3, b.z + b.depth / 2);
      // Неоновые панели-постеры на боковых внешних стенах
      const posterMats = [0x8b5cf6, 0x3b82f6, 0xd946ef].map((c) =>
        track(new THREE.MeshBasicMaterial({ color: c, toneMapped: false, transparent: true, opacity: 0.55 }))
      );
      let pi = 0;
      for (let pz = b.z + 2.5; pz < bz2 - 2.5; pz += 6) {
        for (const [px, face] of [[b.x + OUT_T / 2 + 0.02, 1], [bx2 - OUT_T / 2 - 0.02, -1]] as const) {
          const poster = new THREE.Mesh(track(new THREE.PlaneGeometry(1.6, 1.3)), posterMats[pi++ % posterMats.length]);
          poster.rotation.y = (face * Math.PI) / 2;
          poster.position.set(px, 1.5, pz);
          scene.add(poster);
        }
      }

      const c = CLUB_LAYOUT.corridor;
      const doorW = c ? Math.min(2.4, c.width - 0.4) : 2.4;
      const doorX = c ? c.x + c.width / 2 : b.x + b.width / 2;
      const leftLen = doorX - doorW / 2 - b.x;
      const rightLen = bx2 - (doorX + doorW / 2);
      box(leftLen, 1.0, OUT_T, outerMat, b.x + leftLen / 2, 0.5, bz2);
      box(rightLen, 1.0, OUT_T, outerMat, bx2 - rightLen / 2, 0.5, bz2);
      box(leftLen, 0.03, OUT_T + 0.02, blueNeonMat, b.x + leftLen / 2, 1.015, bz2);
      box(rightLen, 0.03, OUT_T + 0.02, blueNeonMat, bx2 - rightLen / 2, 1.015, bz2);
      // Стеклянные двери входа: рамка с неоном
      box(0.1, 2.4, OUT_T + 0.05, wallTopMat, doorX - doorW / 2, 1.2, bz2);
      box(0.1, 2.4, OUT_T + 0.05, wallTopMat, doorX + doorW / 2, 1.2, bz2);
      box(doorW + 0.2, 0.12, OUT_T + 0.05, wallTopMat, doorX, 2.46, bz2);
      box(doorW - 0.1, 0.04, 0.04, zoneNeonMat, doorX, 2.36, bz2 + OUT_T / 2 + 0.03);

      if (c) {
        const corridorFloor = new THREE.Mesh(
          track(new THREE.PlaneGeometry(c.width, b.depth)),
          track(new THREE.MeshStandardMaterial({ color: 0x1b1840, roughness: 0.5, metalness: 0.2 }))
        );
        corridorFloor.rotation.x = -Math.PI / 2;
        corridorFloor.position.set(doorX, 0.004, b.z + b.depth / 2);
        scene.add(corridorFloor);
        tiles(c.x, b.z, c.width, b.depth, tileMat);
        // Неоновые линии вдоль коридора
        box(0.05, 0.02, b.depth - 0.4, zoneNeonMat, c.x + 0.25, 0.02, b.z + b.depth / 2);
        box(0.05, 0.02, b.depth - 0.4, zoneNeonMat, c.x + c.width - 0.25, 0.02, b.z + b.depth / 2);
      }
      // Коврик с названием клуба перед входом
      const mat = makeMat(brandName);
      track(mat.geometry);
      track(mat.material as THREE.Material);
      mat.position.set(doorX, 0.02, bz2 + 1.1);
      scene.add(mat);
    }

    // Перегородки посередине залов (как в клубе: ряды разделены стенкой с неоновой полосой)
    const glassMat = track(new THREE.MeshStandardMaterial({ color: 0x1c1640, roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0.85 }));
    const neonMat = track(new THREE.MeshBasicMaterial({ color: 0x8b5cf6, toneMapped: false }));
    for (const d of CLUB_LAYOUT.dividers) {
      const len = d.x2 - d.x1;
      const wall = new THREE.Mesh(track(new THREE.BoxGeometry(len, 2.6, 0.12)), glassMat);
      wall.position.set(d.x1 + len / 2, 1.3, d.z);
      scene.add(wall);
      const strip = new THREE.Mesh(track(new THREE.BoxGeometry(len, 0.04, 0.1)), neonMat);
      strip.position.set(d.x1 + len / 2, 2.62, d.z);
      scene.add(strip);
    }

    // Рабочее место: стол, монитор (рамка + экран + подставка), системный блок с подсветкой,
    // клавиатура, кресло (сиденье, спинка, стойка, крестовина) — по одному InstancedMesh на деталь
    const n = slots.length;
    const inst = (geo: THREE.BufferGeometry, mat: THREE.Material) => new THREE.InstancedMesh(track(geo), track(mat), n);
    const dark = () => new THREE.MeshStandardMaterial({ color: 0x14112b, roughness: 0.45, metalness: 0.35 });
    const desks = inst(new THREE.BoxGeometry(1.15, 0.05, 0.7), new THREE.MeshStandardMaterial({ color: 0x221d40, roughness: 0.35, metalness: 0.2 }));
    const legs = inst(new THREE.BoxGeometry(1.05, 0.72, 0.03), dark());
    const frames = inst(new THREE.BoxGeometry(0.76, 0.45, 0.035), dark());
    const monitors = inst(new THREE.PlaneGeometry(0.72, 0.41), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
    const stands = inst(new THREE.BoxGeometry(0.05, 0.2, 0.05), dark());
    const standBase = inst(new THREE.BoxGeometry(0.24, 0.015, 0.16), dark());
    const towers = inst(new THREE.BoxGeometry(0.22, 0.48, 0.46), new THREE.MeshStandardMaterial({ color: 0x0f0c22, roughness: 0.3, metalness: 0.6 }));
    const towerGlow = inst(new THREE.PlaneGeometry(0.16, 0.4), new THREE.MeshBasicMaterial({ color: 0xa855f7, toneMapped: false, transparent: true, opacity: 0.9 }));
    const keyboards = inst(new THREE.BoxGeometry(0.44, 0.018, 0.14), new THREE.MeshStandardMaterial({ color: 0x1a1535, emissive: 0x3b1d7a, emissiveIntensity: 0.6 }));
    const seatsMesh = inst(new THREE.BoxGeometry(0.52, 0.09, 0.5), new THREE.MeshStandardMaterial({ color: 0x2a2350, roughness: 0.7 }));
    const chairs = inst(new THREE.BoxGeometry(0.5, 0.78, 0.1), new THREE.MeshStandardMaterial({ color: 0x2a2350, roughness: 0.7 }));
    const poles = inst(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), dark());
    const bases = inst(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 5), dark());
    const glows = inst(
      new THREE.PlaneGeometry(1.25, 1.9),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    // Невидимые «коробки» для попадания касанием (весь стол целиком)
    const hits = inst(new THREE.BoxGeometry(1.25, 1.2, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    const parts = [desks, legs, frames, monitors, stands, standBase, towers, towerGlow, keyboards, seatsMesh, chairs, poles, bases, glows, hits];

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const place = (mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, rot: number, localZ: number, rx = 0, localX = 0, ry = 0) => {
      const offset = new THREE.Vector3(localX, 0, localZ).applyAxisAngle(up, rot);
      q.setFromEuler(new THREE.Euler(rx, rot + ry, 0));
      m.compose(new THREE.Vector3(x + offset.x, y, z + offset.z), q, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
    };
    slots.forEach((s, i) => {
      const r = s.rotation;
      place(desks, i, s.x, 0.74, s.z, r, 0);
      place(legs, i, s.x, 0.37, s.z, r, -0.3);
      place(standBase, i, s.x, 0.775, s.z, r, -0.2);
      place(stands, i, s.x, 0.88, s.z, r, -0.22);
      place(frames, i, s.x, 1.1, s.z, r, -0.2);
      place(monitors, i, s.x, 1.1, s.z, r, -0.18);
      place(keyboards, i, s.x, 0.775, s.z, r, 0.1);
      place(towers, i, s.x, 0.24, s.z, r, -0.08, 0, 0.42);
      place(towerGlow, i, s.x, 0.24, s.z, r, -0.08, 0, 0.305, -Math.PI / 2);
      place(seatsMesh, i, s.x, 0.48, s.z, r, 0.72);
      place(chairs, i, s.x, 0.92, s.z, r, 0.98, -0.14);
      place(poles, i, s.x, 0.25, s.z, r, 0.72);
      place(bases, i, s.x, 0.04, s.z, r, 0.72);
      place(glows, i, s.x, 0.015, s.z, r, 0.4, -Math.PI / 2);
      place(hits, i, s.x, 0.6, s.z, r, 0.35);
    });
    for (const mesh of parts) {
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
    }

    // Номера над мониторами
    const labels: THREE.Sprite[] = slots.map((s) => {
      const sprite = makeLabel(String(s.number));
      sprite.position.set(s.x, 1.6, s.z - 0.2);
      scene.add(sprite);
      return sprite;
    });

    // Кольцо выбранного ПК
    const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.75, 0.9, 48)), track(new THREE.MeshBasicMaterial({ color: 0xd946ef, side: THREE.DoubleSide, transparent: true, opacity: 0.95 })));
    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    scene.add(ring);

    const color = new THREE.Color();
    let currentSelected: number | null = null;
    const setStates = (states: SeatView[]) => {
      const byNumber = new Map(states.map((s) => [s.number, s.state]));
      slots.forEach((s, i) => {
        const st = byNumber.get(s.number) ?? "unknown";
        color.setHex(STATE_COLOR[st]);
        monitors.setColorAt(i, color.clone().multiplyScalar(st === "unknown" ? 0.6 : 1.15));
        glows.setColorAt(i, color);
      });
      if (monitors.instanceColor) monitors.instanceColor.needsUpdate = true;
      if (glows.instanceColor) glows.instanceColor.needsUpdate = true;
      needsRender = true;
    };
    const setSelected = (num: number | null) => {
      currentSelected = num;
      const slot = slots.find((s) => s.number === num);
      ring.visible = !!slot;
      if (slot) ring.position.set(slot.x, 0.03, slot.z + 0.35);
      labels.forEach((l, i) => l.scale.set(slots[i].number === num ? 1 : 0.7, slots[i].number === num ? 0.5 : 0.35, 1));
      needsRender = true;
    };
    apiRef.current = { setStates, setSelected };

    // Выбор касанием/кликом (без срабатывания при вращении)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downAt: { x: number; y: number } | null = null;
    const pick = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(hits, false)[0];
      return hit?.instanceId !== undefined ? slots[hit.instanceId].number : null;
    };
    const onDown = (e: PointerEvent) => (downAt = { x: e.clientX, y: e.clientY });
    const onUp = (e: PointerEvent) => {
      if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;
      const num = pick(e.clientX, e.clientY);
      if (num !== null) onSelectRef.current(num);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      renderer.domElement.style.cursor = pick(e.clientX, e.clientY) !== null ? "pointer" : "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);

    // Камера «вписывает» весь зал: на вертикальном экране смотрим сбоку, чтобы залы шли сверху вниз
    let lastPortrait: boolean | null = null;
    const frameCamera = (aspect: number) => {
      const portrait = aspect < 0.9;
      const tilt = (52 * Math.PI) / 180; // угол над полом
      const spanH = (portrait ? CLUB_LAYOUT.depth : CLUB_LAYOUT.width) + 4;
      const spanV = (portrait ? CLUB_LAYOUT.width : CLUB_LAYOUT.depth) + 4;
      const vfov = (camera.fov * Math.PI) / 180;
      const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
      const dist = Math.max(spanH / 2 / Math.tan(hfov / 2), (spanV * Math.sin(tilt) * 0.62) / Math.tan(vfov / 2)) * (portrait ? 1.06 : 1.18);
      const azimuth = portrait ? Math.PI / 2 : 0;
      camera.position.set(
        cx + Math.sin(azimuth) * Math.cos(tilt) * dist,
        Math.sin(tilt) * dist,
        cz + Math.cos(azimuth) * Math.cos(tilt) * dist
      );
      controls.target.set(cx, 0, cz);
      controls.maxDistance = dist * 1.6;
      controls.update();
      lastPortrait = portrait;
    };

    // Размер по контейнеру
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      // Переставляем камеру при первом показе и при смене ориентации экрана
      if (lastPortrait === null || lastPortrait !== camera.aspect < 0.9) frameCamera(camera.aspect);
      needsRender = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Рисуем только когда видно и что-то изменилось
    let needsRender = true;
    let visible = true;
    controls.addEventListener("change", () => (needsRender = true));
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);
    let frame = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      controls.update();
      if (currentSelected !== null) {
        const t = clock.getElapsedTime();
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 4) * 0.35;
        needsRender = true;
      }
      if (needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }
    };
    resize();
    loop();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      controls.dispose();
      labels.forEach((l) => {
        l.material.map?.dispose();
        l.material.dispose();
      });
      for (const mesh of parts) mesh.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      host.removeChild(renderer.domElement);
      apiRef.current = null;
    };
  }, [layout, brandName]);

  // Новая сцена (смена схемы) получает текущие цвета и выбор
  const seatsRef = useRef(seats);
  seatsRef.current = seats;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useEffect(() => {
    apiRef.current?.setStates(seatsRef.current);
    apiRef.current?.setSelected(selectedRef.current);
  }, [layout, brandName]);
  useEffect(() => apiRef.current?.setStates(seats), [seats]);
  useEffect(() => apiRef.current?.setSelected(selected), [selected]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
