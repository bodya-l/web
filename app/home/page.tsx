// pages/index.tsx або app/dashboard/page.tsx
import React from 'react';
import RecentlyVisited from '@/components/RecentlyVisited';
import EstablishmentsSection from '@/components/EstablishmentsSection';
import GreenBanner from '@/components/banners/HowItWorksBanner';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HowItWorksBanner from '@/components/banners/HowItWorksBanner';

// Дані для прикладу
const establishmentData = [
  { id: 1, name: 'NAZVA', description: 'A warm and welcoming place for coffee lovers', rating: 4.5, imageUrl: '/images/est1.jpg' },
  { id: 2, name: 'NAZVA', description: 'A warm and welcoming place for coffee lovers', rating: 5, imageUrl: '/images/est2.jpg' },
  { id: 3, name: 'NAZVA', description: 'A warm and welcoming place for coffee lovers', rating: 4, imageUrl: '/images/est3.jpg' },
];

const DashboardPage: React.FC = () => {
  return (
    
    <div className="min-h-screen bg-gray-50">
      <Header 
        breadcrumpText="Breadcrump"
        description="Смак починається з меню"
      />
      

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        

        {/* Секції контенту */}
        <RecentlyVisited />
        
        <EstablishmentsSection data={establishmentData} />

        <HowItWorksBanner  />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;