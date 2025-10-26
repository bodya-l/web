// components/HowItWorksBanner.tsx
import React from 'react';

const HowItWorksBanner: React.FC = () => (
  <section id="system" className="mb-12">
    <div className="bg-gradient-to-r from-[#288A1F] to-[#27C167] rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0 shadow-xl">
      
      {/* Текстова частина */}
      <div className="max-w-md text-center lg:text-left flex-1">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
          Як це все <span className="block">працює насправді?</span>
        </h2>
        <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
          Дізнатися
        </button>
      </div>
      
      {/* Зображення телефону */}
      <div className="w-full max-w-xs lg:ml-8 flex justify-center mb-12">
        <img 
          src="https://expirenza.com/resources/expirenza/img/boxes/magic-boxes@2x.webp" // ⬅️ Вам потрібно додати це зображення у public/images
          alt="Демонстрація додатку" 
          className="max-h-200  object-contain translate-y-6"
          style={{ transform: 'translateY(24px)' }} 
        />
      </div>
    </div>
  </section>
);

export default HowItWorksBanner;