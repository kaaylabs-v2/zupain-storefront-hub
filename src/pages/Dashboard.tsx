
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import DashboardStats from '@/components/DashboardStats';
import OrdersChart from '@/components/OrdersChart';
import StoreSetupProgress from '@/components/StoreSetupProgress';
import { useTheme } from '@/contexts/ThemeContext';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentPalette } = useTheme();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`flex min-h-screen ${currentPalette.background}`}>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 space-y-8">
          <WelcomeSection />
          <DashboardStats />
          <OrdersChart />
          <StoreSetupProgress />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
