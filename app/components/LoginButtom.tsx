import React, { ButtonHTMLAttributes } from 'react';

// Розширення стандартних атрибутів кнопки HTML для підтримки onClick та інших
interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode; // Текст або вміст кнопки
}

const LoginButton: React.FC<LoginButtonProps> = ({ children = 'Log in', className = '', ...props }) => {
  return (
    <a href='/login'>
    <button
      // Основні стилі: Білий фон, округлені кути, зелений текст, тінь.
      className={`
        bg-white 
        text-green-600 
        font-semibold 
        py-2 
        px-4 
        rounded-xl 
        shadow-lg 
        hover:shadow-xl 
        hover:bg-gray-50 
        transition-all 
        duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
    </a>
  );
};

export default LoginButton;