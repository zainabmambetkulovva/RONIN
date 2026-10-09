"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const photos = [
  { src: "/Dota 2 (MOBA).jpg", alt: "Компьютерный зал — вид 1" },
  { src: "/League of Legends (MOBA).jpg", alt: "Компьютерный зал — вид 2" },
  { src: "/Fortnite (Battle Royale).jpg", alt: "Компьютерный зал — вид 3" },
  { src: "/Overwatch 2 (FPS).jpg", alt: "Компьютерный зал — вид 4" },
];

export function CyberComfortPlaces() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="comfort" className="py-24 relative" style={{ background: "#05050f" }} ref={ref}>
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
          className="text-3xl md:text-4xl font-black text-white mb-10 flex items-center gap-4"
        >
          Комфортные&nbsp;места
        </motion.h2>

        {/* Photo grid — asymmetric like on the photo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-xl group ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{
                aspectRatio: i === 0 ? "1 / 1" : "4 / 3",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Dark overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-30"
                style={{ background: "linear-gradient(to top, rgba(5,5,15,0.7) 0%, transparent 60%)" }}
              />
              {/* Neon border glow on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.6)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
