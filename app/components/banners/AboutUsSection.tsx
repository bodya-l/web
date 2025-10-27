// components/AboutUsSection.tsx
import React from 'react';

const AboutUsSection: React.FC = () => (
  <section id="about-us" className="mb-12">
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
      
      {/* Заголовок */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Про нас</h2>
        
        {/* Текст */}
        <p className="text-lg text-gray-600 leading-relaxed">
          Наша платформа допомагає ресторанам, кафе та барам ділитися своїми меню в цифровому форматі та пропонує бонусну систему для заохочення нових клієнтів
        </p>
      </div>
      
      {/* Ілюстрація (Права частина) */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
        <img 
          src="/banners_photos/about-us-illustration.png" // ⬅️ Вам потрібно додати цю ілюстрацію у public/images
          alt="Ілюстрація рукостискання та меню" 
          className="max-w-xs object-contain"
        />
      </div>
    </div>
  </section>
);

export default AboutUsSection;