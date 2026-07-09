import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/' },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath = nextUrl.pathname === '/';
      if (isPublicPath) return true;
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
