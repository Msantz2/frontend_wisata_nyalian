import bcryptjs from 'bcryptjs';

export async function verifyPassword(
  plaintext: string,
  hash: string,
): Promise<boolean> {
  return bcryptjs.compare(plaintext, hash);
}
