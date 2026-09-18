"use client";

import { motion } from "framer-motion";

export function CyberNexusHero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#05050f" }}
    >
      {/* Deep dark BG with purple/blue glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Big purple circle glow — behind character */}
        <div
          className="absolute right-[5%] top-[10%] w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(120,40,220,0.55) 0%, rgba(60,20,140,0.3) 50%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />
        {/* Blue accent bottom left */}
        <div
          className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(30,80,200,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-80px)]">
          {/* ── LEFT CONTENT ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center py-16"
          >
            {/* Logo text big */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-7xl md:text-8xl lg:text-9xl font-black leading-none mb-6"
            >
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 24px rgba(99,102,241,0.6))",
                }}
              >
                Cyber
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 24px rgba(99,102,241,0.6))",
                }}
              >
                Nexus
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-gray-400 text-base leading-relaxed max-w-md mb-8"
            >
              Самая крутая сеть кибер-пространств для любителей, которая соединяет виртуальный мир с
              настоящими лучших стандартами и спиком.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <a
                href="#tariffs"
                className="inline-block px-8 py-3 rounded font-bold uppercase tracking-wider text-white text-sm transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
                  boxShadow: "0 0 24px rgba(99,102,241,0.45)",
                }}
              >
                Забронировать
              </a>
            </motion.div>
          </motion.div>

          {/* ── RIGHT CONTENT — Robot Character ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative flex items-center justify-center py-10"
          >
            {/* Glowing circle behind robot */}
            <div
              className="absolute inset-0 m-auto w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(130,50,255,0.5) 0%, rgba(80,20,200,0.3) 40%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />

            {/* Robot SVG illustration */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <svg
                width="340"
                height="380"
                viewBox="0 0 340 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Body glow */}
                <ellipse cx="170" cy="320" rx="90" ry="22" fill="rgba(120,50,255,0.3)" />

                {/* Ears / side antenna */}
                <rect x="42" y="130" width="18" height="60" rx="9" fill="#1e1040" stroke="#6d28d9" strokeWidth="2"/>
                <rect x="280" y="130" width="18" height="60" rx="9" fill="#1e1040" stroke="#6d28d9" strokeWidth="2"/>
                <circle cx="51" cy="130" r="8" fill="#7c3aed" style={{filter:"drop-shadow(0 0 6px #7c3aed)"}}/>
                <circle cx="289" cy="130" r="8" fill="#7c3aed" style={{filter:"drop-shadow(0 0 6px #7c3aed)"}}/>

                {/* Head */}
                <rect x="80" y="80" width="180" height="150" rx="28" fill="#0f0828"/>
                <rect x="80" y="80" width="180" height="150" rx="28" stroke="#6d28d9" strokeWidth="2"/>
                {/* Head highlight */}
                <rect x="88" y="88" width="164" height="134" rx="22" fill="url(#headGrad)" opacity="0.6"/>

                {/* VR Helmet / visor */}
                <rect x="68" y="110" width="204" height="80" rx="18" fill="#150b38"/>
                <rect x="68" y="110" width="204" height="80" rx="18" stroke="#7c3aed" strokeWidth="2"/>
                {/* Visor glow */}
                <rect x="76" y="118" width="188" height="64" rx="14"
                  fill="url(#visorGrad)" opacity="0.85"
                  style={{filter:"drop-shadow(0 0 12px rgba(120,80,255,0.8))"}}/>
                {/* Visor reflection */}
                <rect x="90" y="124" width="80" height="12" rx="6" fill="rgba(255,255,255,0.07)"/>

                {/* Eyes behind visor */}
                <ellipse cx="130" cy="150" rx="22" ry="18" fill="rgba(80,40,200,0.4)"/>
                <ellipse cx="210" cy="150" rx="22" ry="18" fill="rgba(80,40,200,0.4)"/>
                <ellipse cx="130" cy="150" rx="14" ry="12"
                  fill="#4f46e5"
                  style={{filter:"drop-shadow(0 0 8px #6d28d9)"}}/>
                <ellipse cx="210" cy="150" rx="14" ry="12"
                  fill="#4f46e5"
                  style={{filter:"drop-shadow(0 0 8px #6d28d9)"}}/>
                {/* Eye pupils */}
                <ellipse cx="130" cy="150" rx="7" ry="6" fill="#a78bfa" style={{filter:"drop-shadow(0 0 4px #a78bfa)"}}/>
                <ellipse cx="210" cy="150" rx="7" ry="6" fill="#a78bfa" style={{filter:"drop-shadow(0 0 4px #a78bfa)"}}/>

                {/* Ears/side horns pointy */}
                <polygon points="80,95 60,65 100,85" fill="#1e1040" stroke="#6d28d9" strokeWidth="1.5"/>
                <polygon points="260,95 280,65 240,85" fill="#1e1040" stroke="#6d28d9" strokeWidth="1.5"/>

                {/* Neck */}
                <rect x="145" y="228" width="50" height="30" rx="6" fill="#0c0620"/>
                <rect x="145" y="228" width="50" height="30" rx="6" stroke="#6d28d9" strokeWidth="1.5"/>

                {/* Body / torso */}
                <rect x="70" y="256" width="200" height="100" rx="18" fill="#0c0620"/>
                <rect x="70" y="256" width="200" height="100" rx="18" stroke="#6d28d9" strokeWidth="2"/>
                {/* Chest panel */}
                <rect x="98" y="272" width="144" height="68" rx="10" fill="#120933" stroke="#7c3aed" strokeWidth="1.5"/>
                {/* Chest glow strip */}
                <rect x="110" y="285" width="120" height="8" rx="4"
                  fill="url(#chestGrad)"
                  style={{filter:"drop-shadow(0 0 6px rgba(99,102,241,0.9))"}}/>
                {/* Chest detail dots */}
                <circle cx="120" cy="312" r="5" fill="#4f46e5" style={{filter:"drop-shadow(0 0 4px #6d28d9)"}}/>
                <circle cx="140" cy="312" r="5" fill="#7c3aed" style={{filter:"drop-shadow(0 0 4px #7c3aed)"}}/>
                <circle cx="160" cy="312" r="5" fill="#6d28d9" style={{filter:"drop-shadow(0 0 4px #6d28d9)"}}/>
                <circle cx="180" cy="312" r="5" fill="#4f46e5" style={{filter:"drop-shadow(0 0 4px #6d28d9)"}}/>
                <circle cx="200" cy="312" r="5" fill="#7c3aed" style={{filter:"drop-shadow(0 0 4px #7c3aed)"}}/>
                <circle cx="220" cy="312" r="5" fill="#6d28d9" style={{filter:"drop-shadow(0 0 4px #6d28d9)"}}/>

                {/* Arms */}
                <rect x="16" y="260" width="56" height="90" rx="16" fill="#0c0620" stroke="#6d28d9" strokeWidth="2"/>
                <rect x="268" y="260" width="56" height="90" rx="16" fill="#0c0620" stroke="#6d28d9" strokeWidth="2"/>
                {/* Arm accent */}
                <rect x="22" y="280" width="44" height="6" rx="3" fill="#4f46e5" opacity="0.7"/>
                <rect x="274" y="280" width="44" height="6" rx="3" fill="#4f46e5" opacity="0.7"/>

                {/* Gradients */}
                <defs>
                  <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#1e1040" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3730a3"/>
                    <stop offset="50%" stopColor="#4f46e5"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </linearGradient>
                  <linearGradient id="chestGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="50%" stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Orbiting particle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 m-auto w-[380px] h-[380px]"
              style={{ borderRadius: "50%" }}
            >
              <div
                className="absolute -top-2 left-1/2 w-4 h-4 rounded-full"
                style={{
                  background: "#a78bfa",
                  boxShadow: "0 0 12px 4px rgba(167,139,250,0.7)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
