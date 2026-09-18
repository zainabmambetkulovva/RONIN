"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Phone, Send, Instagram } from "lucide-react";

export function CyberContacts() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="contacts" className="py-20 relative" style={{ background: "#05050f" }} ref={ref}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-black text-white mb-10"
        >
          Контакты
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Address */}
            <div
              className="flex items-start gap-4 p-4 rounded-xl border"
              style={{
                background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                <MapPin className="w-5 h-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Адрес</p>
                <p className="text-white font-medium text-sm">г. Москва, Волгоградская ул. 5</p>
              </div>
            </div>

            {/* Phone */}
            <div
              className="flex items-start gap-4 p-4 rounded-xl border"
              style={{
                background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                <Phone className="w-5 h-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Телефон</p>
                <a href="tel:+78286706888" className="text-white font-medium text-sm hover:text-blue-400 transition-colors">
                  +7 (828) 567 06 88
                </a>
              </div>
            </div>

            {/* Telegram */}
            <div
              className="flex items-start gap-4 p-4 rounded-xl border"
              style={{
                background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                <Send className="w-5 h-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Telegram</p>
                <a href="https://t.me/cybernexus" className="text-white font-medium text-sm hover:text-blue-400 transition-colors">
                  @cybernexus
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div
              className="flex items-start gap-4 p-4 rounded-xl border"
              style={{
                background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                <Instagram className="w-5 h-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Instagram</p>
                <a href="https://instagram.com/cybernexus" className="text-white font-medium text-sm hover:text-blue-400 transition-colors">
                  @cybernexus.club
                </a>
              </div>
            </div>

            {/* Skype */}
            <div
              className="flex items-start gap-4 p-4 rounded-xl border"
              style={{
                background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                {/* Skype icon */}
                <svg className="w-5 h-5" style={{ color: "#818cf8" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.337-1.429l-3.566-.895c-2.87-.72-3.398-2.297-3.398-3.757 0-3.071 2.914-4.225 5.654-4.225 2.543 0 5.532 1.417 5.532 3.308 0 .789-.7 1.238-1.483 1.238-1.487 0-1.228-2.049-4.261-2.049-1.443 0-2.292.655-2.292 1.582 0 .927.906 1.205 1.696 1.382l2.467.621c2.893.737 3.623 2.325 3.623 3.898 0 2.557-1.968 4.419-5.185 4.419zm11.931-2.542A11.956 11.956 0 0 1 24 19.5c0 2.485-1.988 4.5-4.443 4.5a4.392 4.392 0 0 1-2.808-1.012C15.476 23.648 13.771 24 12 24 5.373 24 0 18.627 0 12c0-1.771.352-3.476 1.012-5.012A4.392 4.392 0 0 1 0 4.443C0 1.988 2.015 0 4.469 0c1.03 0 1.979.349 2.74.927A11.966 11.966 0 0 1 12 0c6.627 0 12 5.373 12 12 0 1.625-.323 3.174-.906 4.588z"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Skype</p>
                <a href="skype:cybernexus.club" className="text-white font-medium text-sm hover:text-blue-400 transition-colors">
                  @cybernexus
                </a>
              </div>
            </div>

            {/* Book button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <a
                href="#tariffs"
                className="inline-block w-full text-center px-8 py-3.5 rounded font-black uppercase tracking-wider text-white text-sm transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
                  boxShadow: "0 0 28px rgba(99,102,241,0.4)",
                }}
              >
                Забронировать
              </a>
            </motion.div>
          </motion.div>

          {/* Right — map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative rounded-xl overflow-hidden"
            style={{
              height: "420px",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            {/* Embedded map (Yandex/Google styled dark) */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.2197940278217!2d37.68!3d55.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzAwLjAiTiAzN8KwNDAnNDguMCJF!5e0!3m2!1sru!2sru!4v1000000000000!5m2!1sru!2sru"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Dark overlay to match theme */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(5,5,15,0.15)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
