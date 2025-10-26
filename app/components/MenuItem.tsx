// components/MenuItem.tsx (або .jsx, залежно від налаштувань)

// 1. Визначте інтерфейс (або тип) для Props
interface MenuItemProps {
    name: string;
    weight: string;
    currentPrice: number;
    oldPrice: number;
    bonus: string;
    imageUrl: string;
  }
  
  // 2. Застосуйте інтерфейс до компонента
  const MenuItem = ({ 
    name, 
    weight, 
    currentPrice, 
    oldPrice, 
    bonus, 
    imageUrl 
  }: MenuItemProps) => (
    <div className="flex justify-between items-center py-4 border-b">
      {/* ... Ваш код, який використовує ці змінні ... */}
      <div className="flex-1 pr-4">
        <h3 className="text-xl font-normal text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{weight}</p>
        
        {/* Контейнер для цін і бонусів */}
        <div className="flex items-center space-x-3">
          {/* Поточна ціна */}
          <span className="text-2xl font-bold text-red-600">{currentPrice} грн</span> 
          
          {/* Стара ціна (закреслена) */}
          <span className="text-base text-gray-400 line-through">{oldPrice} грн</span>
          
          {/* Бонус */}
          <span className="text-sm font-semibold bg-green-100 text-green-700 py-0.5 px-2 rounded-full">
            {bonus} <p>lvl.</p>
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <img src={imageUrl} alt={name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
        
        <button className="bg-white border border-gray-300 text-gray-500 p-2 rounded-full hover:bg-gray-50 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    </div>
  );
  
  export default MenuItem;