'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        if (result.error) {
            setError(result.error);
        } else if (result.ok) {
            const updatedSession = await update();
            if (updatedSession?.user?.role === 'OWNER') {
                router.push('/manage/restaurants');
            } else {
                router.push('/menu');
            }
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/auth/check-role' });
    };

    return (
        // Контейнер сторінки
        <main className="pageContainer loginPageContainer">
            
            {/* НОВИЙ WRAPPER, ЩОБ ЗАДАТИ ОДНАКОВУ ШИРИНУ
              ДЛЯ ЗАГОЛОВКА ТА ФОРМИ ВХОДУ 
            */}
            <div className="loginStackWrapper">

                {/* --- НОВИЙ БЛОК: ЗАГОЛОВОК --- */}
                <div className="loginHeaderFrame">
                    <h2 className="loginHeaderTitle">Breadcrump</h2>
                    <p className="loginHeaderSlogan">Смак починається з меню</p>
                </div>
                {/* --- КІНЕЦЬ НОВОГО БЛОКУ --- */}


                {/* Ваш старий блок форми входу, тепер всередині .loginStackWrapper */}
                <div className="loginContentWrapper">
                    {/* Кнопка закриття веде на лендінг */}
                    <Link href="/" className="loginCloseBtn">×</Link>

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

                    <button
                        className="googleBtn"
                        onClick={handleGoogleSignIn}
                    >
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

            </div> {/* Кінець .loginStackWrapper */}
        </main>
    );
}