
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProductsHeader from '@/components/ProductsHeader';
import ProductsFilters from '@/components/ProductsFilters';
import ProductsTable from '@/components/ProductsTable';
import ProductsGrid from '@/components/ProductsGrid';
import ProductsSidebar from '@/components/ProductsSidebar';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <ProductsHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left section - Product filters and data */}
          <div className="lg:col-span-3 space-y-4">
            <ProductsFilters viewMode={viewMode} onViewModeChange={handleViewModeChange} />
            {viewMode === 'list' ? <ProductsTable /> : <ProductsGrid />}
          </div>
          
          {/* Right section - Sidebar */}
          <div className="lg:col-span-1">
            <ProductsSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
