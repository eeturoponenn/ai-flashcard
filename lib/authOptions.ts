import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

type User = {
  id: string,
  email: string,
  password: string
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id + '',
          email: user.email,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback:", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - User:", user);
        const u = user as unknown as User;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/decks`;
    },
  }
}