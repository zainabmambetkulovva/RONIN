@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   ИСПРАВЛЕНИЕ PRISMA CLIENT
echo ========================================
echo.
echo ⚠️  ВАЖНО: Остановите dev сервер (Ctrl+C)
echo    прежде чем продолжить!
echo.
pause

echo.
echo 🔄 Регенерация Prisma Client...
call npx prisma generate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Готово! Теперь запустите:
    echo    npm run dev
    echo.
    echo Затем обновите страницу в браузере.
) else (
    echo.
    echo ❌ Ошибка! Попробуйте вручную:
    echo    npx prisma generate
)

echo.
pause
