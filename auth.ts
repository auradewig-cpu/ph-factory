import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }
        const { email, password } = parsed.data;

        if (email !== process.env.ADMIN_EMAIL) {
          return null;
        }
        const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
        if (!valid) {
          return null;
        }
        return { id: '1', email };
      },
    }),
  ],
});
