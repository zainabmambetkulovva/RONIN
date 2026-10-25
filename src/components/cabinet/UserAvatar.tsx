"use client";

import Image from "next/image";
import type { AvatarDTO } from "@/types/api";

/** Аватар пользователя: выбранная картинка, фото Google или первая буква имени. */
export function UserAvatar({
  name,
  avatarCode,
  image,
  avatars,
  size = 64,
}: {
  name: string;
  avatarCode: string | null | undefined;
  image?: string | null;
  avatars?: AvatarDTO[];
  size?: number;
}) {
  const picked = avatars?.find((a) => a.code === avatarCode);
  const src = picked?.imageUrl ?? (avatarCode?.startsWith("/avatars/") ? avatarCode : null) ?? image ?? null;

  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rn-violet to-rn-magenta font-display font-bold text-white ring-2 ring-rn-violet/40"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? <Image src={src} alt="" fill sizes={`${Math.max(96, size * 3)}px`} quality={92} className="object-cover object-top" /> : (name.trim().charAt(0) || "R").toUpperCase()}
    </span>
  );
}
