// app/homepage/page.tsx
import React from 'react';
import RecentlyVisited from '@/components/RecentlyVisited'; // ⬅️ Імпорт
import EstablishmentsSection from '@/components/EstablishmentsSection'; 
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HowItWorksBanner from '@/components/banners/HowItWorksBanner';

// ...

const DashboardPage: React.FC = () => {
  return (
    
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        breadcrumpText="Breadcrump"
        description="Смак починається з меню"
      />
      

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* ⬅️ Секції контенту */}
        <RecentlyVisited />
        
        <EstablishmentsSection /> 

        <HowItWorksBanner  />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;