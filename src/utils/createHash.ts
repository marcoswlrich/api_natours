import { hash } from 'bcryptjs';

export async function createHash(password: string) {
  const hashNew = await hash(password, 12);

  return hashNew;
}
