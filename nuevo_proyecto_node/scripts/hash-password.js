const bcrypt = require('bcryptjs');

const pwd = process.argv[2];
if (!pwd) {
  console.error('Uso: npm run hash-password -- "tu-contraseña"');
  process.exit(1);
}

console.log(bcrypt.hashSync(pwd, 10));
