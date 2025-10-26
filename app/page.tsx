// app/page.js
'use client'; // Робимо це клієнтським компонентом для завантаження даних
// app/home/page.tsx

import React from 'react';
import BreadcrumbHeader from '@/components/Header';
import QRBanner from '@/components/banners/QRBanner';
import AboutUsSection from '@/components/banners/AboutUsSection';
import HowItWorksBanner from '@/components/banners/HowItWorksBanner';
import Footer from '@/components/Footer'; // Ваш компонент футера

const HomePage = () => {
  return (
    <div className="!min-h-screen !bg-gray-50">
      
      <BreadcrumbHeader 
        breadcrumpText="Breadcrump"
        description="Смак починається з меню"
      />
      
      <main className="!container !mx-auto !px-4 !py-8 !max-w-7xl">
        
        {/* Хлібні крихти та опис тут не потрібні, оскільки вони є в хедері */}

        {/* Контейнери зібрані в потрібному порядку */}
        <QRBanner />
        <AboutUsSection />
        <HowItWorksBanner />
        
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;