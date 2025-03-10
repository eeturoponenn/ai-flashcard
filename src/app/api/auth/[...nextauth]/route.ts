import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

type User = {
  id: number,
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
    session: ({session, token}) => {
      console.log('Session callback', {session, token})
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id
        }
      }
    },
    jwt: ({ token, user}) => {
      console.log('JWT Callback', {token, user})
      if(user){
        const u = user as unknown as User
        return {
          ...token,
          id: u.id
        }
      }
      return token;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }