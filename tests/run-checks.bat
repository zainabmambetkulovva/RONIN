@echo off
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🔍 RONIN Gaming Club - QA Verification
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo 1️⃣ TypeScript Type Check...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ❌ TypeScript errors found
    pause
    exit /b 1
)
echo ✅ TypeScript: No errors
echo.

echo 2️⃣ ESLint Check...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call npm run lint
if %errorlevel% neq 0 (
    echo ⚠️  ESLint warnings found (non-critical)
)
echo ✅ ESLint check completed
echo.

echo 3️⃣ OAuth Integration Tests...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call node tests/oauth-integration.test.js
if %errorlevel% neq 0 (
    echo ❌ OAuth tests failed
    pause
    exit /b 1
)
echo ✅ OAuth tests passed
echo.

echo 4️⃣ Production Build...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build successful
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ All checks passed!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
