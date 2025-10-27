import React from 'react';
import AnalyticsCard from '@/components/AnalyticsCard';
import MostPopularItemsSection from '@/components/MostPopularItemsSection';
import HeaderManager from '@/components/HeaderManager';

// --- SVG Іконки ---

// Стрілка "Назад" (ArrowLeft)
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

// Діаграма (BarChart2)
const BarChart2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>
);

// Зірка (Star)
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Долар (DollarSign)
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// Користувачі (Users)
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 5.74" />
  </svg>
);


const AnalyticsDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50"> 
    <HeaderManager/>
      <main className='container mx-auto px-4 py-8 max-w-7xl'>
        <div className="mb-8">
          <a href="/manager" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4">
            {/* Використання SVG компонента. w-5 h-5 для розміру, text-gray-600 для кольору */}
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> 
            <span className="text-lg font-medium">Analytics</span>
          </a>
          
          <div className="flex items-center text-2xl font-bold text-gray-900">
            {/* Використання SVG компонента. w-6 h-6 для розміру, text-blue-600 для кольору */}
            <BarChart2Icon className="w-6 h-6 mr-2 text-blue-600" /> 
            Analytics Dashboard
          </div>
        </div>

      {/* Картки ключових метрик */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <AnalyticsCard
            icon={<BarChart2Icon className="w-5 h-5 text-purple-600" />}
            title="Total Orders"
            value="12345"
            valueColor="text-green-600"
          />
          <AnalyticsCard
            icon={<DollarSignIcon className="w-5 h-5 text-blue-600" />}
            title="Revenue"
            value="43020.50"
            valueColor="text-blue-600"
          />
          <AnalyticsCard
            icon={<StarIcon className="w-5 h-5 text-yellow-600" />}
            title="Average rating"
            value="4.7"
            valueColor="text-yellow-600"
          />
          <AnalyticsCard
            icon={<UsersIcon className="w-5 h-5 text-purple-600" />}
            title="New customers"
            value="55"
            valueColor="text-purple-600"
          />
        </div>

        {/* Секція найпопулярніших товарів */}
        <MostPopularItemsSection />
      </main>
    </div>
  );
};

export default AnalyticsDashboardPage;