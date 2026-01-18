export function randomString(prefix = 'auto', len = 8): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${prefix}-${s}`;
}

export function randomEmail(): string {
  return `${randomString('user')}.${Date.now()}@example.com`;
}
