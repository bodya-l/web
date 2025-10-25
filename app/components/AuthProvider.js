// app/components/AuthProvider.js
'use client';

// Нам потрібен цей компонент,
// оскільки SessionProvider є клієнтським компонентом
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  // Просто повертаємо SessionProvider, який огортає 
  // решту вашого додатку (children)
  return <SessionProvider>{children}</SessionProvider>;
}