
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Eye, Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryMutations } from '@/hooks/useCategoryMutations';
import { Category, CategoryFilter } from '@/utils/graphql';
import { toast } from '@/hooks/use-toast';
import EditCategoryDrawer from './EditCategoryDrawer';

interface CategoriesTableProps {
  className?: string;
  filter?: CategoryFilter;
}

const CategoriesTable = ({ className, filter }: CategoriesTableProps) => {
  const { currentPalette } = useTheme();
  const { deleteCategory } = useCategoryMutations();
  
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-sm">{fallback}</span>
        </div>
      );
    }

    return (
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
        {isLoading && (
          <span className="text-sm">{categoryName.charAt(0).toUpperCase()}</span>
        )}
        <img 
          src={image}
          alt={categoryName}
          className={`w-full h-full object-cover rounded-full ${isLoading ? 'hidden' : 'block'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
      </div>
    );
  };

  const handleStatusToggle = (id: string) => {
    // TODO: Implement GraphQL mutation for updating category status
    console.log('Toggle status for category:', id);
    // For now, we can just refetch to keep data in sync
    refetch();
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDrawerOpen(true);
  };

  const handleSaveCategory = async (updatedCategory: Category) => {
    console.log('Save category:', updatedCategory);
    // Refetch to get updated data
    await refetch();
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const {success, message} = await deleteCategory(id);
        console.log("success", success);
        if (success === true) {
          toast({
            title: "Success",
            description: "Category deleted successfully",
          });
          refetch();
        } else {
          toast({
            title: "Error",
            description: message || "Failed to delete category",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  // Use GraphQL pagination data
  const totalPages = Math.ceil(pagination.total / itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className={`${currentPalette.cardBg} rounded-lg shadow-sm border p-8 flex items-center justify-center`}>
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
        <div className={`${currentPalette.cardBg} rounded-lg shadow-sm border p-8 text-center`}>
          <p className="text-gray-500">No categories found.</p>
          <Button 
            variant="outline" 
            onClick={refetch}
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className || ''}`}>
        <div className={`${currentPalette.cardBg} rounded-lg shadow-sm border`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="min-w-[120px]">Category</TableHead>
                <TableHead className="min-w-[140px]">Status</TableHead>
                <TableHead className="w-20">Products</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="w-12">
                    <CategoryImage image={category.image} categoryName={category.name} />
                  </TableCell>
                  <TableCell className="font-medium min-w-[120px]">{category.name}</TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={category.status}
                        onCheckedChange={() => handleStatusToggle(category.id)}
                      />
                      <span className="text-sm text-gray-600 w-14">
                        {category.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-20">{category.products}</TableCell>
                  <TableCell className="w-32 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors duration-200"
                            onClick={() => handleEditClick(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit category</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                            onClick={() => {
                              // Handle view category details
                              console.log('View category details:', category.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View category</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete category</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {pagination.total > 0 && (
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-gray-600">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + itemsPerPage, pagination.total)} of {pagination.total} categories
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        </div>

        <EditCategoryDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          category={selectedCategory}
          onSave={handleSaveCategory}
        />
      </div>
    </TooltipProvider>
  );
};

export default CategoriesTable;
