// components/BreadcrumbHeader.tsx
import React from 'react';
import Link from 'next/link'; 

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
        <Link href="/primary_home" passHref legacyBehavior> 
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
          <button 
            className="text-gray-800 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-50"
            aria-label="Профіль користувача"
          >
            <svg 
              className="w-7 h-7" // Збільшуємо розмір, щоб відповідати макету
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default BreadcrumbHeader;