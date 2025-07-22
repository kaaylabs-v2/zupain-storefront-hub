
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CategoriesHeader from '@/components/CategoriesHeader';
import CategoriesFilters from '@/components/CategoriesFilters';
import CategoriesTable from '@/components/CategoriesTable';
import CategoriesGrid from '@/components/CategoriesGrid';
import { useTheme } from '@/contexts/ThemeContext';
import { CategoryFilter } from '@/utils/graphql';

/**
 * Categories Page with GraphQL Filtering
 * 
 * Features:
 * - Manages filter state for categories
 * - Supports both grid and table view modes
 * - Passes filters to child components for GraphQL integration
 */

const Categories = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilter, setCurrentFilter] = useState<CategoryFilter>({});
  const { currentPalette } = useTheme();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleFilterChange = (filter: CategoryFilter) => {
    console.log('Filter changed:', filter); // For debugging
    setCurrentFilter(filter);
  };

  return (
    <div className={`flex min-h-screen ${currentPalette.background}`}>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 space-y-6">
          <CategoriesHeader />
          <CategoriesFilters 
            viewMode={viewMode} 
            onViewModeChange={handleViewModeChange}
            onFilterChange={handleFilterChange}
            initialFilter={currentFilter}
          />
          {viewMode === 'list' ? (
            <CategoriesTable filter={currentFilter} />
          ) : (
            <CategoriesGrid filter={currentFilter} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;
