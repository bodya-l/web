import React from 'react';
import PopularItem from './PopularItem';

// Тип даних для популярного товару
interface ItemData {
  rank: number;
  name: string;
  orders: number;
  revenue: number;
}

// Приклад даних
const popularItemsData: ItemData[] = [
  { rank: 1, name: 'Item 1', orders: 342, revenue: 1300.00 },
  { rank: 2, name: 'Item 2', orders: 342, revenue: 1300.00 },
  { rank: 3, name: 'Item 3', orders: 342, revenue: 1300.00 },
];

const MostPopularItemsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Most Popular Items</h2>
      
      <div className="space-y-2">
        {popularItemsData.map((item) => (
          <PopularItem 
            key={item.rank}
            rank={item.rank}
            name={item.name}
            orders={item.orders}
            revenue={item.revenue}
          />
        ))}
      </div>
    </div>
  );
};

export default MostPopularItemsSection;