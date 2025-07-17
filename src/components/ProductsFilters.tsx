
import React, { useState } from 'react';
import { Plus, Upload, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddProductForm from './AddProductForm';

interface ProductsFiltersProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ProductsFilters = ({ viewMode, onViewModeChange }: ProductsFiltersProps) => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <Tabs defaultValue="all" className="w-auto">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-8 p-0.5">
              <TabsTrigger value="all" className="text-xs px-2 py-1 h-7">All Products</TabsTrigger>
              <TabsTrigger value="active" className="text-xs px-2 py-1 h-7">Active</TabsTrigger>
              <TabsTrigger value="draft" className="text-xs px-2 py-1 h-7">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="text-xs px-2 py-1 h-7">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-3">
            <Select defaultValue="all-categories">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="skincare">Skincare</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="supplements">Supplements</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-brands">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-brands">All Brands</SelectItem>
                <SelectItem value="blameless">Blameless</SelectItem>
                <SelectItem value="vitanix">Vitanix</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="space-x-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            className="space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsAddProductOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
          
          <Button variant="outline" className="space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </Button>
        </div>
      </div>

      <AddProductForm 
        open={isAddProductOpen} 
        onOpenChange={setIsAddProductOpen} 
      />
    </>
  );
};

export default ProductsFilters;
