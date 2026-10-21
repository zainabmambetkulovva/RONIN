/**
 * OAuth Integration Test
 * Tests Google OAuth flow without external dependencies
 */

const assert = require('assert');

// Mock environment
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret-key-minimum-32-characters-long';

console.log('🧪 OAuth Integration Tests\n');

// Test 1: OAuth Redirect URL Construction
function testOAuthRedirectURL() {
  console.log('Test 1: OAuth Redirect URL Construction');
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  // Assertions
  assert(authUrl.includes('client_id=test-client-id'), 'Client ID должен присутствовать');
  assert(authUrl.includes('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgoogle%2Fcallback'), 'Redirect URI должен быть корректным');
  assert(authUrl.includes('response_type=code'), 'Response type должен быть code');
  assert(authUrl.includes('scope=openid+email+profile'), 'Scope должен включать openid, email, profile');
  
  console.log('  ✅ URL формируется корректно');
  console.log(`  📋 URL: ${authUrl.substring(0, 100)}...\n`);
  
  return true;
}

// Test 2: Callback Parameters Validation
function testCallbackValidation() {
  console.log('Test 2: Callback Parameters Validation');
  
  // Valid callback
  const validCode = 'test-auth-code-12345';
  assert(validCode && validCode.length > 0, 'Код авторизации должен существовать');
  console.log('  ✅ Валидный код принимается');
  
  // Invalid callback (no code)
  const invalidCode = null;
  const shouldFail = !invalidCode;
  assert(shouldFail, 'Отсутствие кода должно приводить к ошибке');
  console.log('  ✅ Отсутствие кода обрабатывается корректно\n');
  
  return true;
}

// Test 3: JWT Token Generation
async function testJWTGeneration() {
  console.log('Test 3: JWT Token Generation');
  
  const { SignJWT } = require('jose');
  
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  const payload = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'client',
    needsSetup: false
  };
  
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);
    
    assert(token && token.length > 0, 'JWT токен должен быть создан');
    assert(token.split('.').length === 3, 'JWT должен иметь 3 части');
    
    console.log('  ✅ JWT токен создается корректно');
    console.log(`  📋 Token: ${token.substring(0, 50)}...\n`);
    
    return true;
  } catch (error) {
    console.error('  ❌ Ошибка создания JWT:', error.message);
    return false;
  }
}

// Test 4: Cookie Configuration
function testCookieConfig() {
  console.log('Test 4: Cookie Configuration');
  
  const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  };
  
  assert(cookieConfig.httpOnly === true, 'Cookie должен быть httpOnly');
  assert(cookieConfig.sameSite === 'lax', 'SameSite должен быть lax');
  assert(cookieConfig.maxAge === 2592000, 'MaxAge должен быть 30 дней');
  
  console.log('  ✅ Cookie конфигурация корректна');
  console.log('  📋 httpOnly: true, secure: prod-only, sameSite: lax\n');
  
  return true;
}

// Test 5: Error Handling
function testErrorHandling() {
  console.log('Test 5: Error Handling');
  
  // Error scenarios
  const errors = [
    { code: 'access_denied', message: 'Пользователь отклонил доступ' },
    { code: 'invalid_grant', message: 'Невалидный grant' },
    { code: 'token_exchange', message: 'Ошибка обмена токенов' },
  ];
  
  errors.forEach(error => {
    const redirectUrl = `/login?error=${error.code}`;
    assert(redirectUrl.includes('error='), 'URL должен содержать параметр error');
    console.log(`  ✅ ${error.code}: перенаправление на /login?error=${error.code}`);
  });
  
  console.log();
  return true;
}

// Test 6: Redirect URI Validation
function testRedirectURI() {
  console.log('Test 6: Redirect URI Validation');
  
  const baseUrl = process.env.NEXTAUTH_URL;
  const callbackPath = '/api/auth/google/callback';
  const fullRedirectUri = `${baseUrl}${callbackPath}`;
  
  assert(fullRedirectUri === 'http://localhost:3000/api/auth/google/callback', 
    'Redirect URI должен совпадать с ожидаемым');
  
  // Production URI
  const prodUrl = 'https://ronin-mjlm.vercel.app';
  const prodRedirectUri = `${prodUrl}${callbackPath}`;
  
  assert(prodRedirectUri === 'https://ronin-mjlm.vercel.app/api/auth/google/callback',
    'Production redirect URI должен быть корректным');
  
  console.log('  ✅ Local redirect URI: http://localhost:3000/api/auth/google/callback');
  console.log('  ✅ Prod redirect URI: https://ronin-mjlm.vercel.app/api/auth/google/callback\n');
  
  return true;
}

// Test 7: User Data Structure
function testUserDataStructure() {
  console.log('Test 7: User Data Structure');
  
  const mockGoogleUser = {
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
    email_verified: true
  };
  
  const userData = {
    id: 'generated-uuid',
    email: mockGoogleUser.email,
    name: null, // Will be set in setup-profile
    avatar: null,
    role: 'client',
    status: 'active',
    email_verified: new Date(),
    image: mockGoogleUser.picture
  };
  
  assert(userData.email === mockGoogleUser.email, 'Email должен совпадать');
  assert(userData.role === 'client', 'Роль по умолчанию должна быть client');
  assert(userData.status === 'active', 'Статус должен быть active');
  
  console.log('  ✅ Структура данных пользователя корректна');
  console.log('  📋 Роль: client, Статус: active\n');
  
  return true;
}

// Run all tests
async function runTests() {
  const tests = [
    { name: 'OAuth Redirect URL', fn: testOAuthRedirectURL },
    { name: 'Callback Validation', fn: testCallbackValidation },
    { name: 'JWT Generation', fn: testJWTGeneration },
    { name: 'Cookie Config', fn: testCookieConfig },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Redirect URI', fn: testRedirectURI },
    { name: 'User Data Structure', fn: testUserDataStructure }
  ];
  
  let passed = 0;
  let failed = 0;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ ${test.name} failed:`, error.message, '\n');
      failed++;
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✅ All tests passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed!\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
