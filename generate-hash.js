const bcrypt = require('bcryptjs');

// Использование: node generate-hash.js '<новый пароль>'
// Пароль не хранится в репозитории.
const password = process.argv[2];
if (!password) {
  console.error("Использование: node generate-hash.js '<пароль>'");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('\n✅ Хэш:', hash);
console.log('\nВыполни этот SQL в Neon:\n');
console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@ronin.kg';`);
console.log('\n');
