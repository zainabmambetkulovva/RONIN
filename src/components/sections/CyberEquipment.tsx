"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const equipment = [
  {
    image: "/images (5).jpg",
    category: "Системный блок",
    name: "MSI MAG Z790 / i7-12700",
    specs: [
      { label: "CPU", value: "Intel Core i7-12700F" },
      { label: "GPU", value: "RTX 3060 12GB" },
      { label: "RAM", value: "32GB DDR5 6000MHz" },
      { label: "Хранение", value: "1TB NVMe SSD" },
    ],
    accent: "#3b82f6",
  },
  {
    image: "/images (4).jpg",
    category: "Монитор",
    name: "UltraWide 34\"",
    specs: [
      { label: "Диагональ", value: "34\" 2К" },
      { label: "Частота", value: "240 Hz" },
      { label: "Тип матрицы", value: "IPS" },
      { label: "Яркость", value: "350 нит" },
    ],
    accent: "#8b5cf6",
  },
];

export function CyberEquipment() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="equipment" className="py-20 relative" style={{ background: "#05050f" }} ref={ref}>
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
          Наше оборудование
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative rounded-xl overflow-hidden border"
              style={{
                background: "linear-gradient(135deg, #0d0b2a 0%, #07061a 100%)",
                borderColor: "rgba(99,102,241,0.25)",
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to bottom, rgba(5,5,15,0.2) 0%, rgba(5,5,15,0.85) 100%)",
                  }}
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: `${item.accent}22`,
                      border: `1px solid ${item.accent}55`,
                      color: item.accent,
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-black text-lg mb-4">{item.name}</h3>

                {/* Specs */}
                <div className="space-y-2">
                  {item.specs.map((s, si) => (
                    <div key={si} className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{s.label}</span>
                      <span className="text-gray-200 text-xs font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom accent */}
                <div
                  className="mt-4 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${item.accent}55, transparent)`,
                  }}
                />
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${item.accent}55` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
