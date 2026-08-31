import { randomBytes } from 'node:crypto';

import { deriveAdminPasswordHash } from '../src/core.ts';

const password = process.env.ANALYTICS_ADMIN_PASSWORD_INPUT;
if (!password) {
  console.error('Set ANALYTICS_ADMIN_PASSWORD_INPUT only for this command; the password is never written to a file.');
  process.exit(1);
}

const salt = randomBytes(32).toString('hex');
const hash = await deriveAdminPasswordHash(password, salt);

console.log(`ANALYTICS_ADMIN_PASSWORD_SALT=${salt}`);
console.log(`ANALYTICS_ADMIN_PASSWORD_HASH=${hash}`);
