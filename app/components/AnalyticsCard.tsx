import React from 'react';

interface AnalyticsCardProps {
  icon: React.ReactNode; 
  title: string;
  value: string;
  valueColor: string; 
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon, title, value, valueColor }) => {
  return (
    <div className="flex flex-col p-5 bg-white rounded-xl shadow-lg w-full">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-gray-500">{icon}</span> {/* Тут буде SVG */}
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <p className={`text-4xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
};

export default AnalyticsCard;