'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Loader2, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { club } from '@/config/club';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('code');
      } else {
        setError(data.error || 'Ошибка отправки. Попробуйте позже.');
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('password');
      } else {
        setError(data.error || 'Неверный код');
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Перенаправить на login
        window.location.href = '/login?reset=success';
      } else {
        setError(data.error || 'Ошибка сброса пароля');
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-purple-950/20 px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src="/logo-new.png"
                alt="RONIN"
                fill
                className="object-contain"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))',
                }}
              />
            </div>
            <h1 className="text-3xl font-black text-white">RONIN</h1>
          </Link>
          <p className="text-gray-400 mt-2">
            {step === 'email' && 'Восстановление пароля'}
            {step === 'code' && 'Введите код'}
            {step === 'password' && 'Новый пароль'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-2xl"
        >
          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <p className="text-gray-300 mb-6 text-center">
                Введите email. Мы отправим 6-значный код для сброса пароля.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить код'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Code */}
          {step === 'code' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-300">
                  Код отправлен на <strong className="text-purple-400">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-2 text-center">
                    Введите 6-значный код
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="w-full px-4 py-4 bg-white/5 border border-purple-500/30 rounded-xl text-white text-center text-2xl font-black tracking-widest placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    'Подтвердить'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Изменить email
                </button>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-gray-300">
                  Код подтвержден! Теперь создайте новый пароль.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-2">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Минимум 6 символов"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">
                    Повторите пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Повторите пароль"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    'Сбросить пароль'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к входу
            </Link>
          </div>
        </motion.div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Нужна помощь?{' '}
            <a
              href={club.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Свяжитесь с нами
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
