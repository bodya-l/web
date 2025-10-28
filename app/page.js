// app/home/page.tsx

import React from 'react';
import BreadcrumbHeader from '@/app/components/HeaderCopy';
import QRBanner from '@/components/banners/QRBanner';
import AboutUsSection from '@/components/banners/AboutUsSection';
import HowItWorksBanner from '@/components/banners/HowItWorksBanner';
import Footer from '@/components/Footer'; 

const HomePage= () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <BreadcrumbHeader 
        breadcrumpText="Breadcrump"
        description="Смак починається з меню"
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {}

        {}
        <QRBanner />
        <AboutUsSection />
        <HowItWorksBanner />
        
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;