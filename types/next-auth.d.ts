// types/next-auth.d.ts

import NextAuth, { DefaultSession } from 'next-auth';
// Import Role and User from your Prisma Client
import { Role } from '@prisma/client'; 

declare module 'next-auth' {
  /**
   * Розширюємо тип Session, додаючи поля з нашої моделі User
   */
  interface Session {
    user: {
      // User ID тепер number (Int)
      id: number;      
      // Role тепер Role з Prisma enum
      role: Role;      
    } & DefaultSession['user']; // Зберігаємо існуючі поля (name, email, image)
  }
  
  /**
   * Розширюємо тип User, який передається в колбеки (наприклад, в jwt або session)
   */
  interface User {
    id: number;
    role: Role;
  }
}