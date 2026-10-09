const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('\n✅ Пароль:', password);
console.log('✅ Хэш:', hash);
console.log('\nВыполни этот SQL в Neon:\n');
console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@ronin.kg';`);
console.log('\n');
