"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Loading - 1 second
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: "radial-gradient(circle at center, #1a0b2e 0%, #0a0a14 100%)",
          }}
        >
          {/* Animated circles - centered */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute"
            >
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500" />
            </motion.div>

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute"
            >
              <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full border-4 border-transparent border-b-blue-500 border-l-purple-500" />
            </motion.div>

            {/* Logo - perfectly centered */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 1,
              }}
              className="relative z-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-24 h-24 sm:w-32 sm:h-32"
              >
                <Image
                  src="/logo-new.png"
                  alt="RONIN"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, 128px"
                  style={{
                    filter: "drop-shadow(0 0 40px rgba(168,85,247,1)) drop-shadow(0 0 80px rgba(236,72,153,0.8))",
                  }}
                  priority
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <p className="text-white font-bold text-xl uppercase tracking-widest">
                RONIN
              </p>
              <p className="text-purple-400 text-sm uppercase tracking-wider mt-2">
                Gaming Club
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
