const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
console.log('\nGenerated NEXTAUTH_SECRET:');
console.log(secret);
console.log('\nCopy the above value and set it as an Environment Variable in Vercel settings.\n');
