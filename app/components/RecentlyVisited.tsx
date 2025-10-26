// components/RecentlyVisited.tsx
import React from 'react';

// --- Типи для елементів (оновлено) ---
interface VisitedItem {
  id: number;
  // initials: string; // ⬅️ Більше не потрібні
  bgColor: string;
  date: string;
  slug: string;
  imageUrl: string; // ⬅️ Додаємо поле для шляху до зображення
}

// --- Дані для прикладу (оновлено) ---
const visitedData: VisitedItem[] = [
  // ПРИМІТКА: Вам потрібно створити ці файли зображень у public/
  { id: 1, imageUrl: '/estab_logo/babo_garden.jpeg', bgColor: 'bg-black', date: '22.10.25', slug: 'bg-cafe' },
  { id: 2, imageUrl: '/estab_logo/flat_5.jpg', bgColor: 'bg-green-600', date: '12.10.25', slug: 'flat-pub' },
  { id: 3, imageUrl: '/estab_logo/sic_dvir.jpg', bgColor: 'bg-red-600', date: '16.09.25', slug: 'restaurant-x' }, 
];

// --- Компонент Картки (оновлено) ---
const VisitedCard: React.FC<VisitedItem> = ({ imageUrl, bgColor, date, slug }) => {
  
  // Компонент використовує фонове зображення
  const backgroundStyle = { 
    backgroundImage: `url('${imageUrl}')`,
  };

  return (
    <a href={`/${slug}`} className="text-center group block">
      <div 
        className={`w-16 h-16 rounded-3xl mx-auto mb-2 flex items-center justify-center 
          transition-transform transform group-hover:scale-105 
          bg-cover bg-center border-2 border-transparent hover:border-gray-300 
          ${bgColor}`}
        style={backgroundStyle} // Вставляємо зображення як фон
        aria-label={`Відвідано: ${slug}`}
      >
        {/* Залишаємо div порожнім, оскільки зображення вже встановлено як фон. 
           Текст ініціалів більше не потрібен. 
        */}
      </div>
      <p className="text-xs text-gray-500">{date}</p>
    </a>
  );
};

// --- Компонент Секції ---
const RecentlyVisited: React.FC = () => (
  <section className="mb-12">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently visited</h2>
    <div className="flex space-x-6">
      {visitedData.map(item => (
        <VisitedCard key={item.id} {...item} />
      ))}
    </div>
  </section>
);

export default RecentlyVisited;