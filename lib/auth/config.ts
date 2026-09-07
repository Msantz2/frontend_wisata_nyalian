import type { AuthConfig } from '@/types/auth';

function loadAuthConfig(): AuthConfig {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!username || !passwordHash) {
    throw new Error(
      'ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be defined in .env.local'
    );
  }

  return {
    username,
    passwordHash,
  };
}

export const authConfig = loadAuthConfig();
