"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  {
    title: "Комфортные игровые места",
    description: "Эргономичные кресла и столы для долгих игровых сессий"
  },
  {
    title: "Компьютеры последнего поколения",
    description: "Современное железо для любых игр"
  },
  {
    title: "Выделить место онлайн",
    description: "Бронируйте место через сайт за пару кликов"
  },
  {
    title: "Мы находимся в центре города",
    description: "Удобное расположение с хорошей транспортной доступностью"
  }
];

export function CyberAboutSection() {
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
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-white">Мы пространство для</span>{" "}
            <span className="text-blue-400">любителей игрового мира</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Наше заведение оборудовано последними технологиями для комфортной игры и работы. 
            Профессиональная техника и уютная атмосфера создают идеальные условия.
          </p>
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
