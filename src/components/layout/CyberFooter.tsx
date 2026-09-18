import { Instagram, Send, Phone, MapPin } from "lucide-react";

export function CyberFooter() {
  return (
    <footer
      className="border-t"
      style={{
        background: "#0a0a1a",
        borderColor: "rgba(59,130,246,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <span
              className="text-2xl font-black tracking-widest block"
              style={{
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              RONIN
            </span>
            <p className="text-base text-gray-300 leading-relaxed max-w-xs">
              Современный компьютерный клуб в Бишкеке.
              Мощные ПК, комфортная атмосфера и онлайн-бронирование.
            </p>
            <div className="flex gap-3 pt-1">
              {[
                { href: "https://t.me/ronin_support", icon: Send, label: "Telegram" },
                { href: "https://www.instagram.com/ronin__kg", icon: Instagram, label: "Instagram" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="card-sweep w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.25)",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#60a5fa" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider">Навигация</h4>
            <ul className="space-y-2.5">
              {[
                { href: "#hero", label: "Главная" },
                { href: "#about", label: "О клубе" },
                { href: "#booking-flow", label: "Бронирование" },
                { href: "#computers", label: "Компьютеры" },
                { href: "#games", label: "Игры" },
                { href: "#contacts", label: "Контакты" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#60a5fa" }} />
                <span className="text-base text-gray-300">г. Бишкек, ул. Горького 130, 2 этаж</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 shrink-0" style={{ color: "#60a5fa" }} />
                <a href="tel:+996501004700" className="text-base text-gray-300 hover:text-blue-400 transition-colors">
                  +996 501 004 700
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Send className="w-5 h-5 shrink-0" style={{ color: "#60a5fa" }} />
                <a href="https://t.me/ronin_support" className="text-base text-gray-300 hover:text-blue-400 transition-colors">
                  @ronin_support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}
        >
          <p className="text-sm text-gray-500">
            © 2026 RONIN Cyber Club. Все права защищены.
          </p>
          <p className="text-sm text-gray-500">
            Бишкек, Кыргызстан
          </p>
        </div>
      </div>
    </footer>
  );
}
