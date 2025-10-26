// components/EstablishmentsSection.tsx
import React from 'react';

interface Establishment {
  id: number;
  name: string;
  description: string;
  rating: number;
  imageUrl: string;
}

interface EstablishmentsSectionProps {
  data: Establishment[];
}

// Компонент для відображення зірок рейтингу
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

// Компонент Картки Закладу
const EstablishmentCard: React.FC<Establishment> = ({ name, description, rating, imageUrl }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:shadow-lg hover:scale-[1.01] cursor-pointer">
    {/* Зображення (заглушка) */}
    <div className="h-40 bg-gray-200" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }} />
    
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mb-2 truncate">{description}</p>
      <StarRating rating={rating} />
    </div>
  </div>
);


const EstablishmentsSection: React.FC<EstablishmentsSectionProps> = ({ data }) => (
  <section className="mb-12">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Establishments:</h2>
      <button className="text-blue-600 font-medium hover:text-blue-800 text-sm py-1 px-3 border border-blue-600 rounded-full transition-colors">
        Переглянути всі
      </button>
    </div>
    
    {/* Адаптивна сітка з 1-3 колонок */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(item => (
        <EstablishmentCard key={item.id} {...item} />
      ))}
    </div>
  </section>
);

export default EstablishmentsSection;