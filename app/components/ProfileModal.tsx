// app/components/ProfileModal.tsx
// (Переконайтеся, що файл має розширення .tsx)
'use client'; 

import { signOut } from 'next-auth/react'; // 1. Імпортуємо 'signOut' для кнопки виходу

// 2. Додаємо 'image', оскільки Google його надає
type UserProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null; // Додано 'image'
};

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProps | null;
};

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  
  // 3. Отримуємо 'image' разом з 'name' та 'email'
  const { name, email, image } = user || {};
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (!isOpen) {
    return null;
  }

  return (

    // Оверлей (темний фон)
    <div className="profileOverlay" onClick={onClose}>
            {/* Cаме модальне вікно */}
            <div className="profileModal" onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закриття */}
                <button className="profileCloseButton" onClick={onClose}>×</button>

                {/* Вміст профілю */}
                <div className="profileHeader">
                    <div className="profileAvatar">{image ? (
                                // Якщо є картинка від Google, показуємо її
                                     <img src={image} alt="Avatar" style={{ borderRadius: '50%', width: '100%', height: '100%' }} />
                                        ) : (
                                         // Інакше, показуємо першу літеру імені
                                         initial
                                        )}</div>
                    <div className="profileInfo">
                        <h2>{name || 'Гість'}</h2>
                        <p>{email || 'Email не вказано'}</p>
                    </div>
                </div>

                <div className="profileStatsCard">
                    {/* ... (Тут буде ваша картка зі статистикою) ... */}
                    <p>Restaurants: 2 selected</p>
                    <p>Achievements: 2</p>
                </div>

                <button className="profileMyItemsButton">My Items</button>

                <div className="profileAchievements">
                    <h3>Achievements</h3>
                    <p>CoffeeLover</p>
                    <p>Explorer</p>
                </div>
            </div>
        </div>
  );
}

/**{image ? (
              // Якщо є картинка від Google, показуємо її
              <img src={image} alt="Avatar" style={{ borderRadius: '50%', width: '100%', height: '100%' }} />
            ) : (
              // Інакше, показуємо першу літеру імені
              initial
            )}
            <h2>{name || 'Гість'}</h2>
            <p>{email || 'Email не вказано'}</p>


 */
