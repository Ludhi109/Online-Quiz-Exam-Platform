import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, menuItems, activeTab, setActiveTab, sidebarTitle, headerTitle, headerSubtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      <Sidebar 
        menuItems={menuItems} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        title={sidebarTitle}
      />
      
      <div className="flex-1 md:ml-64 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)} 
            title={headerTitle}
            subtitle={headerSubtitle}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
