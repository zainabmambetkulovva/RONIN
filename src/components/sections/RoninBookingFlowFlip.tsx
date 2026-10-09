"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Home, Monitor, Calendar, CreditCard, CheckCircle, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Home,
    title: "Клуб",
    subtitle: "Выбери филиал",
    description: "Выберите удобную локацию в Бишкеке",
    color: "#3b82f6",
  },
  {
    number: "02",
    icon: Monitor,
    title: "ПК",
    subtitle: "Выбери компьютер",
    description: "93 станции от Standard до VIP",
    color: "#8b5cf6",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Дата",
    subtitle: "Укажи удобную дату",
    description: "Выберите дату и время начала сессии",
    color: "#06b6d4",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Время",
    subtitle: "Выбери время сеанса",
    description: "От 1 часа до ночного пакета",
    color: "#10b981",
  },
  {
    number: "05",
    icon: CheckCircle,
    title: "Оплата",
    subtitle: "Оплати удобным способом",
    description: "Онлайн оплата или наличные в клубе",
    color: "#f59e0b",
  },
  {
    number: "06",
    icon: Sparkles,
    title: "Готово!",
    subtitle: "Бронирование подтверждено",
    description: "Получите QR-код и приходите играть",
    color: "#ec4899",
  },
];

export function RoninBookingFlowFlip() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 relative" style={{ background: "#03030a" }} ref={ref}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #3b82f6)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "#60a5fa" }}>
              КАК ЗАБРОНИРОВАТЬ
            </span>
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #8b5cf6, transparent)" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
            Бронирование за 6 шагов
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="booking-flip-card"
              >
                <div className="booking-flip-content">
                  {/* Front */}
                  <div className="booking-flip-front">
                    <div className="booking-flip-img">
                      <div className="booking-flip-circles">
                        <div className="booking-circle"></div>
                        <div className="booking-circle" id="booking-right"></div>
                        <div className="booking-circle" id="booking-bottom"></div>
                      </div>
                    </div>
                    <div className="booking-flip-front-content">
                      <small className="booking-badge">{step.number}</small>
                      <div className="booking-description">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center mb-3 mx-auto"
                          style={{
                            background: `${step.color}20`,
                            border: `2px solid ${step.color}60`,
                          }}
                        >
                          <Icon className="w-7 h-7" style={{ color: step.color }} />
                        </div>
                        <div className="booking-title">
                          <p className="text-white font-black text-lg">{step.title}</p>
                        </div>
                        <p className="booking-card-footer">{step.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="booking-flip-back" style={{ "--card-color": step.color } as React.CSSProperties}>
                    <div className="booking-back-content">
                      <Icon className="w-12 h-12" style={{ color: step.color }} />
                      <strong className="text-center">{step.description}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .booking-flip-card {
          overflow: visible;
          width: 100%;
          height: 280px;
        }

        .booking-flip-content {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 400ms ease;
          box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.6);
          border-radius: 12px;
        }

        .booking-flip-front,
        .booking-flip-back {
          background-color: #0d0d24;
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
        }

        .booking-flip-back {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotateY(180deg);
        }

        .booking-flip-back::before {
          position: absolute;
          content: ' ';
          display: block;
          width: 200px;
          height: 180%;
          background: linear-gradient(
            90deg,
            transparent,
            var(--card-color),
            var(--card-color),
            var(--card-color),
            var(--card-color),
            transparent
          );
          animation: booking_rotation 5000ms infinite linear;
        }

        .booking-back-content {
          position: absolute;
          width: 98%;
          height: 98%;
          background-color: #0d0d24;
          border-radius: 12px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 20px;
        }

        .booking-flip-card:hover .booking-flip-content {
          transform: rotateY(180deg);
        }

        @keyframes booking_rotation {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }

        .booking-flip-front-content {
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .booking-badge {
          background-color: rgba(59, 130, 246, 0.2);
          padding: 6px 16px;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          width: fit-content;
          font-size: 14px;
          font-weight: bold;
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .booking-description {
          box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
          width: 100%;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
        }

        .booking-title {
          text-align: center;
          margin-bottom: 8px;
        }

        .booking-card-footer {
          color: #9ca3af;
          text-align: center;
          font-size: 13px;
        }

        .booking-flip-img {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(13, 13, 36, 0.8), rgba(7, 7, 26, 0.9));
        }

        .booking-flip-circles {
          pointer-events: none;
        }

        .booking-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.3);
          position: absolute;
          filter: blur(25px);
          animation: booking_floating 3000ms infinite linear;
        }

        #booking-bottom {
          background-color: rgba(139, 92, 246, 0.3);
          left: 60%;
          top: 10%;
          width: 120px;
          height: 120px;
          animation-delay: -1000ms;
        }

        #booking-right {
          background-color: rgba(236, 72, 153, 0.3);
          right: 10%;
          bottom: 20%;
          width: 80px;
          height: 80px;
          animation-delay: -2000ms;
        }

        @keyframes booking_floating {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}
