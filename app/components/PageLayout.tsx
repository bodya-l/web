// components/PageLayout.tsx
import React from 'react';
import Sidebar from './SideBar'; // Припускаємо, що Sidebar також .tsx

// Використання 'children' з React.PropsWithChildren
const PageLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex min-h-screen bg-white">
    <div className="container mx-auto p-4 lg:p-6 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-8 mt-4 lg:mt-0">
        {children}
      </main>
    </div>
  </div>
);
export default PageLayout;