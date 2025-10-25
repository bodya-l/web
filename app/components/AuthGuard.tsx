// app/components/AuthGuard.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Це тип для пропсів, він очікує 'children'
type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Тут живе ВСЯ логіка перевірки, яку ми винесли
  useEffect(() => {
    // Чекаємо, поки сесія завантажиться
    if (status === 'loading') {
      return; // Ще нічого не робимо
    }

    // Якщо статус НЕ 'authenticated', відправляємо на логін
    if (status !== 'authenticated') {
      router.push('/login');
    }
  }, [status, router]); // Залежність від 'status'

  // 1. Поки йде завантаження, показуємо завантажувач
  if (status === 'loading') {
    return (
      <main className="pageContainer" style={{ textAlign: 'center', paddingTop: '50px' }}>
        <p>Перевірка сесії...</p>
      </main>
    );
  }

  // 2. Якщо юзер залогінений, показуємо сторінку
  if (status === 'authenticated') {
    return <>{children}</>; // 'children' - це ваша сторінка (наприклад, MenuPage)
  }

  // 3. Якщо юзер не залогінений, нічого не показуємо
  // (бо 'useEffect' вище вже почав перенаправлення)
  return null;
}