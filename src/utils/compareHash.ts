import { compare } from 'bcryptjs';

export async function compareHash(password: string, hash: string) {
  return await compare(password, hash);
}
