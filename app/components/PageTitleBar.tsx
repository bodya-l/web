import React from 'react';

const ChevronLeft = ({ className = "w-6 h-6" }: { className?: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>);
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4z"></path></svg>);
const BoxIcon = ({ className = "w-5 h-5" }: { className?: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8 4l8 4 8-4M4 7l8 4 8-4"></path></svg>);
const DollarSignIcon = ({ className = "w-5 h-5" }: { className?: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.485 0-4.5 2.015-4.5 4.5S9.515 17 12 17s4.5-2.015 4.5-4.5S14.485 8 12 8zM12 2v2m0 16v2m-8-8H4m16 0h2m-5.46-9.46l-1.41 1.41M5.92 18.08l1.41-1.41m12.73-12.73l-1.41 1.41M5.92 5.92l1.41 1.41"></path></svg>);
const StarIcon = ({ className = "w-5 h-5", fill = "currentColor" }: { className?: string, fill?: string }) => (<svg className={className} fill={fill} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>);
const UsersIcon = ({ className = "w-5 h-5" }: { className?: string }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-3V12h-2v8H8v-8H6v8H3m18 0H14m0-4h-2m2 4h-2m-8 0H3m6-4H7m-4 4h-2M5 11a4 4 0 11-8 0 4 4 0 018 0zm10 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>);

const PageTitleBar: React.FC = () => (
    <div className="container mx-auto px-6 pt-4 max-w-7xl">
        {/* Заголовок сторінки */}
        <div className="flex items-center space-x-4 mb-4">
            <button className="text-gray-900 hover:text-gray-700 transition-colors" aria-label="Назад">
                <ChevronLeft />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
        </div>
        
        {/* Analytics Dashboard підзаголовок */}
        <div className="flex items-center text-gray-900 space-x-2 pb-6">
            <span role="img" aria-label="dashboard icon">📊 </span>
            <span className="text-lg font-bold">Analytics Dashboard</span>
        </div>
    </div>
);