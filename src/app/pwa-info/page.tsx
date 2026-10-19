'use client';

import { motion } from 'framer-motion';
import { Smartphone, Zap, WifiOff, Bell, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PWAInfoPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Smartphone,
      title: 'Установка на устройство',
      description: 'Добавьте RONIN на главный экран вашего смартфона или компьютера',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Быстрая загрузка',
      description: 'Приложение кэширует данные для мгновенного доступа',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: WifiOff,
      title: 'Работает офлайн',
      description: 'Просматривайте основную информацию даже без интернета',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Bell,
      title: 'Push уведомления',
      description: 'Получайте напоминания о бронированиях и акциях',
      color: 'from-green-500 to-blue-500'
    }
  ];

  const installSteps = {
    android: [
      'Откройте сайт в Chrome',
      'Нажмите на меню (три точки)',
      'Выберите "Установить приложение"',
      'Подтвердите установку'
    ],
    ios: [
      'Откройте сайт в Safari',
      'Нажмите на кнопку "Поделиться"',
      'Прокрутите и выберите "На экран Домой"',
      'Нажмите "Добавить"'
    ],
    desktop: [
      'Откройте сайт в Chrome или Edge',
      'В адресной строке справа появится значок',
      'Нажмите на значок установки',
      'Подтвердите установку'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950/20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад на главную
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-6">
            <Download className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Установите приложение RONIN
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Получите лучший опыт с нативным приложением на вашем устройстве
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-black text-white text-center mb-8">
            Как установить?
          </h2>

          {/* Android */}
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              Android
            </h3>
            <ol className="space-y-3">
              {installSteps.android.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* iOS */}
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🍎</span>
              iOS (iPhone/iPad)
            </h3>
            <ol className="space-y-3">
              {installSteps.ios.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Desktop */}
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">💻</span>
              Компьютер (Windows/Mac)
            </h3>
            <ol className="space-y-3">
              {installSteps.desktop.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
          >
            <Download className="w-5 h-5" />
            Вернуться и установить
          </Link>
          
          <p className="text-gray-400 text-sm mt-4">
            Установка займёт всего несколько секунд
          </p>
        </motion.div>
      </div>
    </div>
  );
}
