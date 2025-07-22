/**
 * CategoriesGrid Component with GraphQL Integration
 * 
 * Features:
 * - Fetches categories data from GraphQL API using useCategories hook
 * - Supports pagination and filtering
 * - Proper error handling and user feedback
 * - Consistent with CategoriesTable implementation
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Edit, Eye, Trash2, ShoppingBag, Sparkles, MoreHorizontal, MapPin, Phone, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCategories } from '@/hooks/useCategories';
import { Category, CategoryFilter } from '@/utils/graphql';
import EditCategoryDrawer from './EditCategoryDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoriesGridProps {
  className?: string;
  filter?: CategoryFilter;
}

const CategoriesGrid = ({ className, filter }: CategoriesGridProps) => {
  const { currentPalette } = useTheme();
  
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Grid typically shows more items per page

  // Use GraphQL hook for data fetching
  const { categories, loading, error, pagination, refetch } = useCategories(
    itemsPerPage,
    (currentPage - 1) * itemsPerPage,
    filter
  );

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Component to handle category image with fallback
  const CategoryImage = ({ image, categoryName }: { image: string; categoryName: string }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if the image is a URL or emoji/text
    const isUrl = image && (image.startsWith('http') || image.startsWith('/'));

    if (!isUrl || imageError) {
      // Show emoji or first letter as fallback
      const fallback = image && !isUrl ? image : categoryName.charAt(0).toUpperCase();
      return (
        <div className={`w-12 h-12 ${getCategoryColor(categoryName)} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
          {fallback}
        </div>
      );
    }

    return (
      <div className={`w-12 h-12 ${getCategoryColor(categoryName)} rounded-lg flex items-center justify-center overflow-hidden`}>
        {isLoading && (
          <span className="text-white font-bold text-lg">{categoryName.charAt(0).toUpperCase()}</span>
        )}
        <img 
          src={image}
          alt={categoryName}
          className={`w-full h-full object-cover rounded-lg ${isLoading ? 'hidden' : 'block'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
      </div>
    );
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDrawerOpen(true);
  };

  const handleSaveCategory = (updatedCategory: Category) => {
    // TODO: Implement GraphQL mutation for updating category
    console.log('Save category:', updatedCategory);
    // Refetch to get updated data
    refetch();
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // TODO: Implement GraphQL mutation for deleting category
      console.log('Delete category:', id);
      refetch();
    }
  };

  const getCategoryInitial = (categoryName: string) => {
    return categoryName.charAt(0).toUpperCase();
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'vitanix serum category':
        return 'bg-blue-600';
      case 'vitanix sunscreen category':
        return 'bg-blue-600';
      default:
        return 'bg-blue-600';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (categories?.length === 0) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No categories found.</p>
          <Button 
            variant="outline" 
            onClick={refetch}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
            <CardContent className="p-6">
              {/* Header with initial and actions */}
              <div className="flex items-start justify-between mb-4">
                <CategoryImage image={category.image} categoryName={category.name} />
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      console.log('View category details:', category.id);
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEditClick(category)}
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white border shadow-lg z-50">
                      <DropdownMenuItem onClick={() => handleEditClick(category)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          console.log('View category details:', category.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Category name */}
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {category.name}
              </h3>
              
              {/* Brand/Type - using first word of category name */}
              <p className="text-sm text-blue-600 mb-3">
                {category.name.split(' ')[0]}
              </p>

              {/* Description */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <p>{category.description || 'No description available'}</p>
              </div>

              {/* Products count */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span>{category.products} products</span>
              </div>

              {/* Status and revenue */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant={category.status ? "default" : "secondary"}
                  className={`${category.status 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' 
                    : 'bg-red-100 text-red-600 hover:bg-red-100'
                  } font-medium border-0 text-xs`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${category.status ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  {category.status ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} categories
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPreviousPage) handlePageChange(currentPage - 1);
                  }}
                  className={!pagination.hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNextPage) handlePageChange(currentPage + 1);
                  }}
                  className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <EditCategoryDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoriesGrid;
