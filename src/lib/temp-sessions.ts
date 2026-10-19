// Хранилище временных сессий (в production использовать Redis)
export const tempSessions = new Map<string, { userId: string; timestamp: number }>();

// Очистка старых сессий (>5 минут)
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of tempSessions.entries()) {
    if (now - session.timestamp > 5 * 60 * 1000) {
      tempSessions.delete(token);
    }
  }
}, 60 * 1000);
