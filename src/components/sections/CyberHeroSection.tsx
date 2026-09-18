"use client";

import { motion } from "framer-motion";

export function CyberHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* Blue glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10">
              <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">
                Cyber Nexus
              </span>
            </div>

            {/* Main title */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="block text-blue-400 neon-text-blue">Cyber</span>
              <span className="block text-blue-400 neon-text-blue">Nexus</span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
              Мы — пространство для любителей игрового мира. 
              Современное оборудование, комфортная атмосфера и 
              профессиональный сервис ждут вас!
            </p>

            {/* CTA Button */}
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                ЗАБРОНИРОВАТЬ
              </button>
            </div>
          </motion.div>

          {/* Right content - 3D character placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Glowing circle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full blur-3xl"></div>
              
              {/* Character placeholder */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-8xl">🤖</div>
              </div>

              {/* Orbiting elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Листай вниз</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
