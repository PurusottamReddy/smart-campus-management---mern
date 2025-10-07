const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(64).toString('hex');
}

console.log('Your new JWT_SECRET is:');
console.log(generateSecret());
