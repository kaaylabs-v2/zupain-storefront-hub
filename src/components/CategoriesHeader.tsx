
import React, { useState } from 'react';
import { Plus, Package, TrendingUp, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import EditCategoryDrawer from './EditCategoryDrawer';
import { useCategoriesSummary } from '@/hooks/useCategories';
import { formatLastUpdated } from '@/lib/utils';

const CategoriesHeader = () => {
  const { summary, loading, error } = useCategoriesSummary();
  console.log("summary",summary);
  const { currentPalette } = useTheme();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const handleAddCategory = () => {
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategory = async (category: any) => {
    console.log('Saving category:', category);
    // Refetch categories to get updated data
    // The refetch will be handled by the parent component or category list
    setIsAddCategoryOpen(false);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced Page Title with Icon - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Categories Management</h1>
            <p className="text-gray-600 text-sm md:text-base">Organize and manage your product categories</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-3 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Live data</span>
          </div>
          <span>•</span>
          <span>Last updated: {formatLastUpdated(summary.lastUpdated)}</span>
        </div>
      </div>

      {/* Dashboard Stats Cards - Mobile responsive grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="p-2 md:p-3 bg-blue-500 rounded-xl shadow-sm">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{summary.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="p-2 md:p-3 bg-emerald-500 rounded-xl shadow-sm">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{summary.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="p-2 md:p-3 bg-orange-500 rounded-xl shadow-sm">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Inactive Categories</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{summary.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="p-2 md:p-3 bg-purple-500 rounded-xl shadow-sm">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{summary.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Section - Mobile responsive */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50/30 rounded-2xl overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600 text-sm md:text-base">Manage your categories efficiently with these tools</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleAddCategory}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4 md:px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Category Drawer */}
      <EditCategoryDrawer
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        category={null}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoriesHeader;
