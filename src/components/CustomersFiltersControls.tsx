import React, { useState } from 'react';
import { Search, Download, Upload, Users, Plus, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomersFiltersControlsProps {
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
}

const CustomersFiltersControls = ({ viewMode, setViewMode }: CustomersFiltersControlsProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: 'All Customers', count: 25 },
    { id: 'new-not-signed', label: 'New (Not Signed)', count: 8 },
    { id: 'new-signed', label: 'New (Signed In)', count: 5 },
    { id: 'repeated', label: 'Returning', count: 10 },
    { id: 'abandoned', label: 'Abandoned Cart', count: 2 }
  ];

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-white to-blue-50/20 rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section: Enhanced Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Enhanced Search Section */}
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-sm placeholder-gray-400"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
                </div>
              </div>
            </div>
            
            {/* Enhanced Filter Dropdown */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</span>
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-[180px] bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50 rounded-lg p-1">
                  {filterOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="rounded-md">
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {option.count}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Right Section: View Toggle and Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-3.5 h-3.5 mr-1.5" />
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5 mr-1.5" />
                Cards
              </Button>
            </div>
            
            <Button variant="outline" className="flex items-center gap-1.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-2 transition-all duration-200">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-sm">Import</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg px-3 py-2 transition-all duration-200">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-sm">Export</span>
            </Button>
            <Button className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-sm">Add</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomersFiltersControls;