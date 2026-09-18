import { Instagram, MessageCircle, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ronin-neon/10 bg-gradient-to-b from-ronin-black to-[#0a0a1f] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-black ronin-gradient-text">RONIN</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Современный компьютерный клуб в Бишкеке. Мощные ПК, комфортная атмосфера и онлайн-бронирование.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "#about", label: "About Us" },
                { href: "#games", label: "Games" },
                { href: "#computers", label: "Features" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-ronin-neon transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Information</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">+996 700 000 000</li>
              <li>
                <a href="mailto:info@ronin.kg" className="text-sm text-gray-400 hover:text-ronin-neon transition-colors">
                  info@ronin.kg
                </a>
              </li>
              <li className="text-sm text-gray-400">г. Бишкек, ул. Турусбекова 56</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Opening Hours</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">Пн - Чт: 10:00 - 02:00</li>
              <li className="text-sm text-gray-400">Пт: 10:00 - 04:00</li>
              <li className="text-sm text-gray-400">Сб: 12:00 - 04:00</li>
              <li className="text-sm text-gray-400">Вс: 12:00 - 02:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-ronin-neon/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              Copyright ©2026 All rights reserved | RONIN Cyber Club
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-ronin-neon/10 border border-ronin-neon/30 hover:bg-ronin-neon hover:border-ronin-neon flex items-center justify-center transition-all group"
              >
                <Facebook className="w-5 h-5 text-ronin-neon group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-ronin-neon/10 border border-ronin-neon/30 hover:bg-ronin-neon hover:border-ronin-neon flex items-center justify-center transition-all group"
              >
                <Instagram className="w-5 h-5 text-ronin-neon group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://wa.me/996700000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-ronin-neon/10 border border-ronin-neon/30 hover:bg-ronin-neon hover:border-ronin-neon flex items-center justify-center transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-ronin-neon group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-ronin-neon/10 border border-ronin-neon/30 hover:bg-ronin-neon hover:border-ronin-neon flex items-center justify-center transition-all group"
              >
                <Linkedin className="w-5 h-5 text-ronin-neon group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
