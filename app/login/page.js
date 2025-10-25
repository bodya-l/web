// app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { IoMdClose } from 'react-icons/io'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to login');
            }

            router.push('/menu');

        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { 
          callbackUrl: '/menu',
          prompt: 'select_account', // Цей рядок залишаємо, він правильний
        }) 
      }

    return (
        // ВИКОРИСТОВУЄМО НОВІ КЛАСИ-КОНТЕЙНЕРИ
        <main className="pageContainer loginPageContainer">
            <div className="loginContentWrapper">
                <Link href="/menu" className="loginCloseBtn">×</Link>

                <h1 className="loginTitle">Вхід</h1>

                <form onSubmit={handleLogin}>
                    <div className="inputGroup">
                        <input
                            type="email"
                            className="loginInput"
                            placeholder="Введіть e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <input
                            type="password"
                            className="loginInput"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="loginError">{error}</p>}

                    <button type="submit" className="loginSubmitBtn">
                        Вхід
                    </button>
                </form>

                <button className="googleBtn"
                onClick={handleGoogleSignIn}>
                    <span className="googleIcon">G</span> Продовжити через Google
                </button>

                <div className="loginLinks">
                    <Link href="/login?role=owner" className="loginLink">
                        Увійти як власник
                    </Link>
                    <Link href="/signup" className="loginLink">
                        Ще не зареєстрований?
                    </Link>
                </div>
            </div>
        </main>
    );
}