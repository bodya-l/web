
"use client"
// components/Sidebar.tsx
import React, { useState } from 'react';

// --- Типи та Дані (Залишаємо ТІЛЬКИ ОДИН РАЗ) ---

interface Subcategory {
  name: string;
  slug: string; 
}

interface Category {
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

const menuData: Category[] = [
  {
    name: 'Кухня',
    slug: 'kitchen',
    subcategories: [
      { name: 'Гарячі страви', slug: 'gariachi-stravy' },
      { name: 'Піца', slug: 'pizza' },
      { name: 'Паста', slug: 'pasta' },
    ],
  },
  { name: 'Напої', 
    slug: 'drinks',
    subcategories: [
      {name: "Холодні", slug: 'cold'},
      {name: "Гарячі", slug: 'hot'}
    ]
  },
  { name: 'Алкоголь',
    slug: 'alcohol',
    subcategories: [
      {name: "Пиво", slug: "beer"},
      {name: "Вино", slug: "wine"},
      {name: "Щось міцніше)", slug: "strong"}
    ]
  },
];

// --- Компонент Sidebar ---
const Sidebar: React.FC = () => {
  // Встановлюємо початковий активний slug (перша підкатегорія 'Гарячі страви')
  const [activeSlug, setActiveSlug] = useState<string>('gariachi-stravy');
  
  // Встановлюємо початково відкриту батьківську категорію ('Кухня')
  const [openCategory, setOpenCategory] = useState<string | null>('kitchen');

  /**
   * Обробляє клік по елементу меню, оновлює активний елемент та скролить.
   */
  const handleItemClick = (slug: string, isParent: boolean = false) => {
    // 1. Оновлюємо активний елемент
    setActiveSlug(slug);
    
    // 2. Імітуємо скрол до секції
    // Використовуємо replace, щоб не засмічувати історію браузера
    if (typeof window !== 'undefined') {
        window.location.replace(`#${slug}`);
    }


    // 3. Якщо це батьківська категорія, керуємо Accordion
    if (isParent) {
      // Якщо категорія вже відкрита, закриваємо, інакше відкриваємо
      setOpenCategory(openCategory === slug ? null : slug);
    } else {
        // Якщо вибрана підкатегорія, переконаємось, що батьківська категорія відкрита
        // (хоча вона вже мала бути відкритою, щоб її клікнути)
        const parent = menuData.find(cat => cat.subcategories?.some(sub => sub.slug === slug));
        if (parent) {
            setOpenCategory(parent.slug);
        }
    }
  };

  /**
   * Перевіряє, чи є батьківська категорія активною (підсвічується зеленим).
   */
  const isParentActive = (category: Category) => {
    // Категорія активна, якщо її slug співпадає з активним slug,
    // АБО якщо активний slug належить до її підкатегорій
    return category.slug === activeSlug || category.subcategories?.some(sub => sub.slug === activeSlug) || false;
  };
  
  // Класи для активного стану (стиль border-left)
  const activeClasses = 'text-green-600 font-semibold border-l-4 border-green-600 pl-4 -ml-4';
  const inactiveClasses = 'text-gray-500 hover:text-gray-700';

  return (
    <nav className="w-1/4 max-w-xs hidden lg:block border-r pr-6">
      {menuData.map((category) => {
        const parentActive = isParentActive(category);
        const parentIsOpen = openCategory === category.slug;
        
        // Визначаємо, чи має батьківський елемент бути клікабельним для Accordion
        const hasSubcategories = !!category.subcategories && category.subcategories.length > 0;

        return (
          <div key={category.slug} className="mb-2">
            
            {/* Батьківська Категорія */}
            <div
              className={`text-lg py-2 cursor-pointer transition-colors flex justify-between items-center 
                ${parentActive ? activeClasses : inactiveClasses} 
                ${!hasSubcategories ? 'mt-4' : 'font-medium'}
                ${parentActive && !hasSubcategories ? 'border-l-4 border-green-600 pl-4 -ml-4' : ''}
              `}
              // Якщо є підкатегорії, клік відкриває/закриває. Інакше просто активує.
              onClick={() => handleItemClick(category.slug, hasSubcategories)}
            >
              {category.name}
              
              {/* Іконка Accordion (якщо є підкатегорії) */}
              {hasSubcategories && (
                <svg 
                  className={`w-4 h-4 transform transition-transform ${parentIsOpen ? 'rotate-180' : 'rotate-0'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
            </div>

            {/* Підкатегорії (Conditional Rendering) */}
            {hasSubcategories && parentIsOpen && (
              <div className="pl-6 border-l ml-[-4px] border-gray-200">
                {category.subcategories!.map((sub) => { // Використовуємо ! бо ми перевірили hasSubcategories
                  const subIsActive = sub.slug === activeSlug;
                  return (
                    <div
                      key={sub.slug}
                      className={`text-base py-1.5 cursor-pointer transition-colors hover:text-gray-700 
                        ${subIsActive ? 'text-green-600 font-semibold' : 'text-gray-500'}
                      `}
                      onClick={() => handleItemClick(sub.slug)}
                    >
                      {sub.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
export default Sidebar;