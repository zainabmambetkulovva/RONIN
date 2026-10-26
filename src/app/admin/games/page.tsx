import Link from "next/link";

export default function GamesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Игры</h1>
      <p className="text-gray-400">
        Список игр и обложки настраиваются в разделе{" "}
        <Link href="/admin/settings" className="text-rn-cyan hover:text-white">
          «Настройки → Игры»
        </Link>
        .
      </p>
    </div>
  );
}
