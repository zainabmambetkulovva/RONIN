"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function CyberAboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      title: "Топовое железо",
      description: "RTX 4090, i9-13900K, 165Hz мониторы"
    },
    {
      title: "24/7 работаем",
      description: "Круглосуточно без выходных"
    },
    {
      title: "Кибер-атмосфера",
      description: "RGB подсветка, удобные кресла"
    },
    {
      title: "Выгодные тарифы",
      description: "От 150₸/час, ночные пакеты"
    }
  ];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 relative bg-black" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="flex items-center gap-3 mb-3 justify-center">
            <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "#60a5fa" }}>
              О нас
            </span>
            <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Почему RONIN?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-950/30 to-black border border-blue-500/20 hover:border-blue-500/50 transition-all h-full">
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
