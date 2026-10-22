"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a14]">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 mx-auto mb-4"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" 
            style={{
              boxShadow: "0 0 40px rgba(168,85,247,0.6)"
            }}
          />
        </motion.div>
        
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-2xl font-black uppercase bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
        >
          RONIN
        </motion.h2>
        
        <p className="text-gray-400 text-sm mt-2">Загрузка...</p>
      </div>
    </div>
  );
}
