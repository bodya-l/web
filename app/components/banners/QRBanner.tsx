// components/QRBanner.tsx
import React from 'react';

const QRBanner: React.FC = () => (
  <section id="qr-code" className="mb-12">
    <div className="bg-gradient-to-r from-[#288A1F] to-[#4FB845] rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 shadow-xl">
      
      {/* Ліва частина: Заголовок та Кнопки (без змін) */}
      <div className="flex-1 max-w-lg lg:pr-8">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
          QR-код <span className="block">для ресторанів</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          
          <button className="bg-white text-green-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap">
            <a href='https://docs.google.com/forms/d/e/1FAIpQLSecsaEKbTRWhgUMyEmiL5y9_P0ayrzEfRQvl3ry4N_UAwtXYw/viewform?usp=dialog'>Підключити заклад</a>
          </button>
          
          <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition-colors whitespace-nowrap">
            Увійти в кабінет
          </button>
        </div>
      </div>
      
      {/* Права частина: Зображення (ОНОВЛЕНО) */}
      
      {/* ЗМІНА №1: Прибрали 'lg:justify-end', щоб зсунути трохи лівіше
      */}
      <div className="w-full max-w-sm lg:w-1/3 flex justify-center">
        <img 
          src="https://expirenza.com/resources/expirenza/img/expirenza/expz-app-line@2x.webp" // <-- Шлях не змінено, як ви просили
          alt="Демонстрація меню на телефоні з QR-кодом" 
          
          /* ЗМІНА №2: Нові класи для форми та кутів
            - h-64: фіксована висота
            - w-48: фіксована ширина (робить його вертикальним)
            - rounded-2xl: заокруглені кути
            - object-cover: обрізає фото, щоб воно заповнило рамки
          */
          className="h-64 w-100%  object-cover"
        />
      </div>
    </div>
  </section>
);

export default QRBanner;