/**
 * CategoriesFilters Component with Client-Side Filtering
 * 
 * Features:
 * - Status filtering (All, Active, Inactive) - Client-side
 * - Category type filtering - Client-side  
 * - Search functionality - Client-side
 * - View mode toggle
 * - Will be upgraded to GraphQL filtering when backend supports it
 */

import React, { useState, useEffect } from 'react';
import { Grid3X3, List, SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryFilter } from '@/utils/graphql';

interface CategoriesFiltersProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFilterChange?: (filter: CategoryFilter) => void;
  initialFilter?: CategoryFilter;
}

const CategoriesFilters = ({ 
  viewMode, 
  onViewModeChange, 
  onFilterChange,
  initialFilter 
}: CategoriesFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(initialFilter?.searchQuery || '');
  const [statusFilter, setStatusFilter] = useState<string>(
    initialFilter?.status === null || initialFilter?.status === undefined 
      ? 'all' 
      : initialFilter?.status 
        ? 'active' 
        : 'inactive'
  );
  const [typeFilter, setTypeFilter] = useState(initialFilter?.type || 'all-types');

  // Note: Client-side filtering until backend GraphQL filtering is implemented
  // The filter will be applied in the component level for now

  const handleFilterUpdate = () => {
    if (!onFilterChange) return;

    const filter: CategoryFilter = {};

    // Status filter - will be used for client-side filtering
    if (statusFilter === 'active') {
      filter.status = true;
    } else if (statusFilter === 'inactive') {
      filter.status = false;
    } else {
      filter.status = null; // All categories
    }

    // Type filter - will be used for client-side filtering
    if (typeFilter && typeFilter !== 'all-types') {
      filter.type = typeFilter;
    }

    // Search query - will be used for client-side filtering
    if (searchQuery.trim()) {
      filter.searchQuery = searchQuery.trim();
      filter.name = searchQuery.trim();
    }

    onFilterChange(filter);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterUpdate();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter updates
  useEffect(() => {
    handleFilterUpdate();
  }, [statusFilter, typeFilter]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all-types');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all-types';

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-64"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</span>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Type Filter */}
        <div className="flex items-center space-x-3">
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="serum">Serum</SelectItem>
              <SelectItem value="sunscreen">Sunscreen</SelectItem>
              <SelectItem value="skincare">Skincare</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="space-x-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>More Filters</span>
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* View Mode Toggle */}
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
      </div>
    </div>
  );
};

export default CategoriesFilters;
