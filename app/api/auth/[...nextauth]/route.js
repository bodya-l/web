// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

// ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ▼▼▼
// Замінюємо "@/" на відносний шлях, щоб сервер 100% знайшов файл
import prisma from "../../../lib/prisma"
// ▲▲▲ ▲▲▲ ▲▲▲

/** @type {import('next-auth').AuthOptions} */
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id 
      }
      return session
    },
  },
  
  // Логи, які допоможуть нам, якщо проблема не в імпорті
  debug: true, 
  events: {
    async signIn(message) {
      console.log('=============================')
      console.log('Подія [signIn]', message.user)
      console.log('=============================')
    },
    async createUser(message) {
      console.log('=============================')
      console.log('Подія [createUser]', message.user)
      console.log('=============================')
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }