"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ClubLayout } from "@/config/club-layout";

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

function makeFloorText(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 72px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(196,181,253,0.55)";
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/**
 * 3D-зал на three.js: столы, кресла и мониторы — InstancedMesh (мало вызовов отрисовки, быстро на телефоне),
 * цвет экрана и подсветки пола — состояние ПК. Вращение/масштаб пальцем или мышью, выбор ПК — касанием.
 */
export default function ClubMap3D({ layout, seats, selected, onSelect }: ClubMap3DProps) {
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
    scene.add(new THREE.AmbientLight(0x8b7cff, 0.55));
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

    const edgeMat = track(new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.8 }));
    const wallMat = track(new THREE.MeshStandardMaterial({ color: 0x16123a, roughness: 0.7, transparent: true, opacity: 0.55 }));
    for (const zone of CLUB_LAYOUT.zones) {
      const wallGeo = track(new THREE.BoxGeometry(zone.width, 0.6, zone.depth));
      const edges = new THREE.LineSegments(track(new THREE.EdgesGeometry(wallGeo)), edgeMat);
      edges.position.set(zone.x + zone.width / 2, 0.3, zone.z + zone.depth / 2);
      scene.add(edges);
      // Низкие «бортики» по периметру зоны
      for (const [w, d, x, z] of [
        [zone.width, 0.08, zone.x + zone.width / 2, zone.z],
        [0.08, zone.depth, zone.x, zone.z + zone.depth / 2],
        [0.08, zone.depth, zone.x + zone.width, zone.z + zone.depth / 2],
      ] as const) {
        const wall = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.6, d)), wallMat);
        wall.position.set(x, 0.3, z);
        scene.add(wall);
      }
      const label = makeFloorText(zone.label);
      track(label.geometry);
      track(label.material as THREE.Material);
      label.position.set(zone.x + zone.width / 2, 0.02, zone.z + zone.depth - 0.5);
      label.scale.setScalar(zone.width < 5 ? 0.6 : 1);
      scene.add(label);
    }

    // Перегородки посередине залов (как в клубе: ряды разделены стенкой с неоновой полосой)
    const glassMat = track(new THREE.MeshStandardMaterial({ color: 0x1c1640, roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0.72 }));
    const neonMat = track(new THREE.MeshBasicMaterial({ color: 0x8b5cf6, toneMapped: false }));
    for (const d of CLUB_LAYOUT.dividers) {
      const len = d.x2 - d.x1;
      const wall = new THREE.Mesh(track(new THREE.BoxGeometry(len, 1.5, 0.08)), glassMat);
      wall.position.set(d.x1 + len / 2, 0.75, d.z);
      scene.add(wall);
      const strip = new THREE.Mesh(track(new THREE.BoxGeometry(len, 0.04, 0.1)), neonMat);
      strip.position.set(d.x1 + len / 2, 1.52, d.z);
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
      const spanH = (portrait ? CLUB_LAYOUT.depth : CLUB_LAYOUT.width) + 2;
      const spanV = (portrait ? CLUB_LAYOUT.width : CLUB_LAYOUT.depth) + 2;
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
  }, [layout]);

  // Новая сцена (смена схемы) получает текущие цвета и выбор
  const seatsRef = useRef(seats);
  seatsRef.current = seats;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useEffect(() => {
    apiRef.current?.setStates(seatsRef.current);
    apiRef.current?.setSelected(selectedRef.current);
  }, [layout]);
  useEffect(() => apiRef.current?.setStates(seats), [seats]);
  useEffect(() => apiRef.current?.setSelected(selected), [selected]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
