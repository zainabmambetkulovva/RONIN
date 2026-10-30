"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
import { club } from "@/config/club";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

export function AIChatWidget({ position = "bottom-right" }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Привет! Я AI помощник RONIN Gaming Club. Чем могу помочь?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "Какие игры популярны?",
    "Какой тариф выбрать?",
    "Как забронировать?",
    "Где вы находитесь?"
  ];

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: messageText }
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.text || "Ошибка AI");
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.text }
      ]);
    } catch (error: any) {
      console.error("AI chat error:", error);
      
      let errorMessage = "Извините, произошла ошибка. ";
      
      if (error.message.includes("API key")) {
        errorMessage += `AI сервис временно недоступен. Пожалуйста, свяжитесь с нами:\n📞 ${club.phone.display}\n📱 WhatsApp: ${club.socials.whatsapp}`;
      } else {
        errorMessage += `Попробуйте позже или свяжитесь с нами по телефону ${club.phone.display}.`;
      }
      
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Кнопку можно перетащить пальцем или мышью; место запоминается (на этом устройстве)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ai-button-offset") || "null");
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") setOffset(saved);
    } catch {
      /* нет хранилища — остаётся на месте */
    }
  }, []);

  const clampOffset = (x: number, y: number) => {
    const el = wrapRef.current;
    if (!el) return { x, y };
    const r = el.getBoundingClientRect();
    // Исходное положение кнопки без сдвига
    const baseLeft = r.left - offset.x;
    const baseTop = r.top - offset.y;
    const size = 56;
    const minX = 8 - (baseLeft + r.width - size);
    const maxX = window.innerWidth - 8 - (baseLeft + r.width);
    const minY = 8 - (baseTop + r.height - size);
    const maxY = window.innerHeight - 8 - (baseTop + r.height);
    return { x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) };
  };

  const onButtonPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onButtonPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true;
    if (isOpen) setIsOpen(false);
    setOffset(clampOffset(d.baseX + dx, d.baseY + dy));
  };
  const onButtonPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      try {
        localStorage.setItem("ai-button-offset", JSON.stringify(offset));
      } catch {
        /* ignore */
      }
      return;
    }
    setIsOpen((o) => !o);
  };

  const positionClasses = position === "bottom-right"
    ? "bottom-4 right-4 sm:bottom-6 sm:right-6"
    : "bottom-4 left-4 sm:bottom-6 sm:left-6";

  return (
    <div
      ref={wrapRef}
      className={`fixed ${positionClasses} z-[60] mb-20 sm:mb-4`}
      // Открытый чат — на обычном месте, чтобы окно помещалось на экране
      style={{ transform: isOpen ? undefined : `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            // Телефон: панель снизу во всю ширину (над нижним меню), крестик — в заголовке; компьютер — над кнопкой
            className="fixed inset-x-2 bottom-[5.5rem] z-[61] flex h-[calc(100svh-7.5rem)] max-h-[640px] flex-col overflow-hidden rounded-2xl shadow-2xl sm:static sm:mb-4 sm:h-auto sm:w-[400px] sm:max-h-[min(600px,calc(100vh-8rem))]"
            style={{
              background: "linear-gradient(135deg, rgba(7,7,26,0.98), rgba(13,13,36,0.98))",
              border: "1px solid rgba(59,130,246,0.3)",
              boxShadow: "0 0 60px rgba(59,130,246,0.3)"
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4"
              style={{
                background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                borderBottom: "1px solid rgba(59,130,246,0.2)"
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.5)"
                  }}
                >
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Помощник</h3>
                  <p className="text-gray-400 text-xs">RONIN Gaming Club</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4 sm:h-[400px] sm:flex-none">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white/5 text-gray-200 border border-white/10"
                    }`}
                    style={{
                      boxShadow: msg.role === "user"
                        ? "0 0 20px rgba(59,130,246,0.3)"
                        : "none"
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                    {/* Как в мессенджерах: «печатает» с тремя прыгающими точками */}
                    <span className="flex items-end gap-1" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                    <span className="text-gray-400 text-sm">Печатает…</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-400 mb-2">Быстрые вопросы:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(reply)}
                      className="text-xs px-3 py-2 rounded-lg text-left transition-all hover:scale-105"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        color: "#93c5fd"
                      }}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div
              className="p-4"
              style={{
                borderTop: "1px solid rgba(59,130,246,0.2)"
              }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Задай вопрос..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  style={{
                    background: "rgba(15,15,30,0.6)",
                    border: "1px solid rgba(59,130,246,0.3)"
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.4)"
                  }}
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onPointerDown={onButtonPointerDown}
        onPointerMove={onButtonPointerMove}
        onPointerUp={onButtonPointerUp}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setIsOpen((o) => !o))}
        aria-label="AI"
        className={`w-14 h-14 rounded-full items-center justify-center shadow-2xl relative overflow-hidden touch-none cursor-grab active:cursor-grabbing ${isOpen ? "hidden sm:flex" : "flex"}`}
        style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 0 40px rgba(59,130,246,0.6)"
        }}
      >
        {/* Pulse animation */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.6), transparent)"
          }}
        />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
