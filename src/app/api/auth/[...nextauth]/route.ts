import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createAPIClient } from '@/utils/api';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const api = createAPIClient();
          const response = await api.post('/login', new URLSearchParams({
            username: credentials.email,
            password: credentials.password,
          }));

          const user = response.data;

          if (user?.access_token) {
            return {
              id: user.id,
              email: credentials.email,
              accessToken: user.access_token,
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accessToken = user.accessToken;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
