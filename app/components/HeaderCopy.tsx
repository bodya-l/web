// components/BreadcrumbHeader.tsx
import React from 'react';
import Link from 'next/link'; 
import LoginButton from './LoginButtom';
// Типи для цього хедера
interface BreadcrumbHeaderProps {
  breadcrumpText: string;
  description: string;
}

const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({ 
  breadcrumpText = "Breadcrumb", 
  description = "Смак починається з меню" 
}) => {
  return (
    // Знімаємо sticky та тінь, оскільки на макеті вони не виражені
    <header className="bg-white border-b border-gray-100"> 
      <div className="container mx-auto px-4 lg:px-6 py-6 flex justify-between items-center">
        
        {/* Ліва частина: Breadcrumb та Опис */}
        {/* Link веде на корінь або ту ж сторінку */}
        <Link href="/homepage" passHref legacyBehavior> 
            <div className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity">
                
                {/* Заголовок Breadcrumb (зелений) */}
                <h1 className="text-2xl font-bold text-green-600">
                    {breadcrumpText}
                </h1>
                
                {/* Опис */}
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </Link>

        {/* Права частина: Іконка Користувача (як на макеті) */}
        <div className="flex items-center space-x-4">
          
          {/* Іконка Користувача */}

          <LoginButton>
          </LoginButton>

        </div>
      </div>
    </header>
  );
};

export default BreadcrumbHeader;