"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2, Ban, CheckCircle, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { UserAvatar } from "@/components/cabinet/UserAvatar";
import type { AvatarDTO } from "@/types/api";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
    avatar: string | null;
    image?: string | null;
    createdAt: string;
  };
  avatars?: AvatarDTO[];
  onDelete: (userId: string) => void;
  onBlock: (userId: string, currentStatus: string) => void;
}

export function UserCard({ user, avatars, onDelete, onBlock }: UserCardProps) {
  const { t, language } = useLanguage();
  
  const roleColors: Record<string, string> = {
    client: "#3b82f6",
    manager: "#8b5cf6",
    admin: "#ec4899",
  };

  const roleLabels: Record<string, string> = {
    client: t("admin.clients") || "Клиент",
    manager: t("admin.managers") || "Менеджер",
    admin: t("admin.admins") || "Администратор",
  };
  
  const statusLabel = user.status === "active" ? t("admin.active") : t("admin.blocked");

  const roleColor = roleColors[user.role] || "#6b7280";
  const statusColor = user.status === "active" ? "#10b981" : "#ef4444";
  
  const getDateLocale = () => {
    switch (language) {
      case "ru":
        return ru;
      case "ky":
        return ru; // fallback to ru for kyrgyz
      default:
        return enUS;
    }
  };

  const getAvatarGradient = () => {
    const num = user.id.charCodeAt(0);
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      "linear-gradient(135deg, #06b6d4, #3b82f6)",
      "linear-gradient(135deg, #8b5cf6, #ec4899)",
      "linear-gradient(135deg, #10b981, #06b6d4)",
      "linear-gradient(135deg, #f59e0b, #ef4444)",
    ];
    return gradients[num % gradients.length];
  };

  return (
    <div
      className="rounded-2xl p-6 transition-all hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
        border: `1px solid ${roleColor}33`,
      }}
    >
      {/* Avatar and Name */}
      <div className="flex items-start gap-4 mb-4">
        {/* Персонаж, выбранный в профиле (или фото Google); без него — буква на градиенте */}
        {avatars?.some((a) => a.code === user.avatar) || user.avatar?.startsWith("/avatars/") || user.image ? (
          <UserAvatar name={user.name} avatarCode={user.avatar} image={user.image} avatars={avatars} size={64} />
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0"
            style={{
              background: getAvatarGradient(),
              color: "#fff",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg mb-1 truncate">{user.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2 py-1 rounded text-xs font-bold uppercase"
              style={{
                background: `${roleColor}22`,
                color: roleColor,
                border: `1px solid ${roleColor}44`,
              }}
            >
              {roleLabels[user.role]}
            </span>
            <span
              className="px-2 py-1 rounded text-xs font-bold uppercase"
              style={{
                background: `${statusColor}22`,
                color: statusColor,
                border: `1px solid ${statusColor}44`,
              }}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {user.email && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{user.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            {format(new Date(user.createdAt), "dd MMM yyyy", { locale: getDateLocale() })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onBlock(user.id, user.status)}
          className="flex-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center justify-center gap-2"
          style={{
            background:
              user.status === "active"
                ? "rgba(239,68,68,0.2)"
                : "rgba(16,185,129,0.2)",
            border:
              user.status === "active"
                ? "1px solid rgba(239,68,68,0.3)"
                : "1px solid rgba(16,185,129,0.3)",
            color: user.status === "active" ? "#ef4444" : "#10b981",
          }}
        >
          {user.status === "active" ? (
            <>
              <Ban className="w-4 h-4" />
              Блок
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Актив
            </>
          )}
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
          style={{
            background: "rgba(239,68,68,0.2)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
