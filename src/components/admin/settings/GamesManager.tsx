"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Gamepad2, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { Button, ErrorNote, Loading } from "@/components/admin/ui";
import type { GameDTO } from "@/types/api";

/** Сжимает обложку в браузере (до 900 px по большей стороне) и отдаёт data URL WebP. */
export async function resizeCover(file: File, maxSide = 900): Promise<string> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error("Подходят PNG, JPEG или WebP");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Не удалось прочитать картинку"));
      el.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function call<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Не удалось сохранить");
  return data as T;
}

/** Игры для блока «Популярные игры»: добавить, переименовать, загрузить обложку, удалить. Изменения применяются сразу. */
export function GamesManager() {
  const [games, setGames] = useState<GameDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState({ name: "", genre: "", image: null as string | null });
  const [busy, setBusy] = useState<string | null>(null);
  const addFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    call<{ games: GameDTO[] }>("/api/admin/settings/games", "GET")
      .then((d) => setGames(d.games))
      .catch((e) => setError(e.message));
  }, []);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(null);
    }
  };

  const replace = (game: GameDTO) => setGames((list) => list?.map((g) => (g.id === game.id ? game : g)) ?? null);

  const add = () =>
    run("add", async () => {
      const { game } = await call<{ game: GameDTO }>("/api/admin/settings/games", "POST", {
        name: adding.name,
        genre: adding.genre,
        ...(adding.image && { image: adding.image }),
      });
      setGames((list) => [...(list ?? []), game]);
      setAdding({ name: "", genre: "", image: null });
    });

  if (!games && !error) return <Loading />;

  return (
    <div className="space-y-3">
      {error && <ErrorNote>{error}</ErrorNote>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {games?.map((g) => (
          <GameRow
            key={g.id}
            game={g}
            busy={busy === g.id}
            onSave={(patch) =>
              run(g.id, async () => {
                const { game } = await call<{ game: GameDTO }>(`/api/admin/settings/games/${g.id}`, "PATCH", patch);
                replace(game);
              })
            }
            onDelete={() =>
              confirm(`Удалить «${g.name}» из списка игр?`) &&
              run(g.id, async () => {
                await call(`/api/admin/settings/games/${g.id}`, "DELETE");
                setGames((list) => list?.filter((x) => x.id !== g.id) ?? null);
              })
            }
            onError={setError}
          />
        ))}
      </ul>

      {/* Добавить игру */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-rn-line p-3">
        <button
          type="button"
          onClick={() => addFileRef.current?.click()}
          className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-rn-line bg-rn-night text-rn-muted hover:text-white"
          aria-label="Обложка новой игры"
        >
          {adding.image ? <Image src={adding.image} alt="" fill unoptimized className="object-cover" /> : <ImagePlus className="h-5 w-5" />}
        </button>
        <input
          ref={addFileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              const image = await resizeCover(file);
              setAdding((a) => ({ ...a, image }));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Не удалось загрузить");
            }
          }}
        />
        <label className="min-w-[10rem] flex-1 text-sm">
          <span className="mb-1 block text-xs text-rn-muted">Название</span>
          <input value={adding.name} onChange={(e) => setAdding({ ...adding, name: e.target.value })} maxLength={60} className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2 text-white outline-none focus:border-rn-violet" placeholder="Например, PUBG" />
        </label>
        <label className="w-36 text-sm">
          <span className="mb-1 block text-xs text-rn-muted">Жанр</span>
          <input value={adding.genre} onChange={(e) => setAdding({ ...adding, genre: e.target.value })} maxLength={30} className="w-full rounded-xl border border-rn-line bg-rn-night px-3 py-2 text-white outline-none focus:border-rn-violet" placeholder="FPS" />
        </label>
        <Button variant="primary" onClick={add} loading={busy === "add"} disabled={!adding.name.trim()}>
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>
    </div>
  );
}

function GameRow({
  game,
  busy,
  onSave,
  onDelete,
  onError,
}: {
  game: GameDTO;
  busy: boolean;
  onSave: (patch: { name?: string; genre?: string; image?: string | null }) => void;
  onDelete: () => void;
  onError: (message: string) => void;
}) {
  const [name, setName] = useState(game.name);
  const [genre, setGenre] = useState(game.genre);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = name.trim() !== game.name || genre.trim() !== game.genre;

  useEffect(() => {
    setName(game.name);
    setGenre(game.genre);
  }, [game.name, game.genre]);

  return (
    <li className="flex gap-3 rounded-xl border border-rn-line/70 bg-rn-night/50 p-3">
      <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-rn-line bg-gradient-to-br from-rn-violet/40 to-rn-void">
        {game.imageUrl ? (
          <Image src={game.imageUrl} alt={game.name} fill sizes="72px" unoptimized className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-white/70">
            <Gamepad2 className="h-6 w-6" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label="Название" className="w-full rounded-lg border border-rn-line bg-rn-night px-2.5 py-1.5 text-sm text-white outline-none focus:border-rn-violet" />
        <input value={genre} onChange={(e) => setGenre(e.target.value)} maxLength={30} aria-label="Жанр" placeholder="Жанр" className="w-full rounded-lg border border-rn-line bg-rn-night px-2.5 py-1.5 text-xs text-white outline-none focus:border-rn-violet" />
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                onSave({ image: await resizeCover(file) });
              } catch (err) {
                onError(err instanceof Error ? err.message : "Не удалось загрузить");
              }
            }}
          />
          <IconButton label={game.imageUrl ? "Заменить обложку" : "Загрузить обложку"} onClick={() => fileRef.current?.click()} disabled={busy}>
            <ImagePlus className="h-3.5 w-3.5" />
          </IconButton>
          {game.imageUrl && (
            <IconButton label="Убрать обложку" onClick={() => onSave({ image: null })} disabled={busy}>
              <X className="h-3.5 w-3.5" />
            </IconButton>
          )}
          {dirty && (
            <IconButton label="Сохранить" onClick={() => onSave({ name: name.trim(), genre: genre.trim() })} disabled={busy || !name.trim()} accent>
              <Save className="h-3.5 w-3.5" />
            </IconButton>
          )}
          <IconButton label="Удалить игру" onClick={onDelete} disabled={busy} danger>
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </li>
  );
}

function IconButton({ label, onClick, disabled, children, danger, accent }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; danger?: boolean; accent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] transition disabled:opacity-40 ${
        danger ? "border-rose-500/30 text-rose-300 hover:bg-rose-500/10" : accent ? "border-rn-violet bg-rn-violet/20 text-white" : "border-rn-line text-rn-muted hover:text-white"
      }`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
