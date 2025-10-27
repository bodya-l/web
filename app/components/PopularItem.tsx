import React from 'react';

interface PopularItemProps {
  rank: number;
  name: string;
  orders: number;
  revenue: number;
}

const PopularItem: React.FC<PopularItemProps> = ({ rank, name, orders, revenue }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      
      {/* Ліва частина: Ранг, Зображення, Назва, Замовлення */}
      <div className="flex items-center space-x-4">
        <span className="text-xl font-medium text-gray-400 w-8 text-left">#{rank}</span>
        
        {/* Заглушка для зображення */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div> 
        
        <div>
          <p className="text-base font-medium text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{orders} orders</p>
        </div>
      </div>
      
      {/* Права частина: Дохід */}
      <div className="text-right">
        <p className="text-lg font-semibold text-green-600">
          {revenue.toFixed(2)}₴
        </p>
        <p className="text-xs text-gray-500">revenue</p>
      </div>
    </div>
  );
};

export default PopularItem;