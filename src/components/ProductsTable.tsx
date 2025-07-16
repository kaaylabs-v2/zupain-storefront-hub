/**
 * ProductsTable Component with GraphQL Integration
 * 
 * Features:
 * - Fetches products data from GraphQL API using useProducts hook
 * - Supports sorting, pagination, and filtering
 * - Proper error handling and user feedback
 * - Consistent with ProductsGrid implementation
 */

import React, { useState, useMemo } from 'react';
import { Edit, MoreHorizontal, Eye, Copy, Archive, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilter } from '@/utils/graphql';

interface ProductsTableProps {
  className?: string;
  filter?: ProductFilter;
}

type SortField = 'name' | 'price' | 'inventory' | 'rating' | 'orders';
type SortDirection = 'asc' | 'desc' | null;

const ProductsTable = ({ className, filter }: ProductsTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use GraphQL hook for data fetching
  const { products, loading, error, pagination, refetch } = useProducts(
    itemsPerPage,
    (currentPage - 1) * itemsPerPage,
    filter
  );

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    if (sortDirection === 'asc') return <ChevronUp className="w-4 h-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="w-4 h-4" />;
    return null;
  };

  const sortedProducts = useMemo(() => {
    if (!sortField || !sortDirection) return products;

    return [...products].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'name') {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection, products]);

  // Use GraphQL pagination data
  const totalPages = Math.ceil(pagination.total / itemsPerPage);
  const currentProducts = sortedProducts;

  const getInventoryStatus = (inventory: number) => {
    if (inventory === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (inventory <= 10) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-50' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      Active: 'bg-green-100 text-green-800',
      Draft: 'bg-gray-100 text-gray-800',
      Archived: 'bg-red-100 text-red-800'
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.Draft;
  };

  const formatPrice = (price: number) => `₹${price}.00`;

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="bg-white rounded-lg border p-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Loading products...</span>
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
  if (products?.length === 0) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-500">No products found.</p>
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
    <div className={`space-y-6 ${className || ''}`}>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="w-16 pl-6">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead className="w-80">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-gray-900 font-medium"
                >
                  <span>Product</span>
                  {getSortIcon('name')}
                </button>
              </TableHead>
              <TableHead className="w-32">SKU</TableHead>
              <TableHead className="w-32">Category</TableHead>
              <TableHead className="w-32">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center space-x-1 hover:text-gray-900 font-medium"
                >
                  <span>Price</span>
                  {getSortIcon('price')}
                </button>
              </TableHead>
              <TableHead className="w-32">
                <button
                  onClick={() => handleSort('inventory')}
                  className="flex items-center space-x-1 hover:text-gray-900 font-medium"
                >
                  <span>Inventory</span>
                  {getSortIcon('inventory')}
                </button>
              </TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">
                <button
                  onClick={() => handleSort('rating')}
                  className="flex items-center space-x-1 hover:text-gray-900 font-medium"
                >
                  <span>Rating</span>
                  {getSortIcon('rating')}
                </button>
              </TableHead>
              <TableHead className="w-32">
                <button
                  onClick={() => handleSort('orders')}
                  className="flex items-center space-x-1 hover:text-gray-900 font-medium"
                >
                  <span>Total Orders</span>
                  {getSortIcon('orders')}
                </button>
              </TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts?.map((product) => {
              const inventoryStatus = getInventoryStatus(product.inventory);
              return (
                <TableRow key={product.id} className="hover:bg-gray-50/50">
                  <TableCell className="pl-6">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell className="py-4 max-w-[400px]">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product?.image} 
                        alt={product?.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{product?.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-600">{product.sku}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">{product?.category?.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-900">{product.inventory}</span>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${inventoryStatus.color}`}>
                        {inventoryStatus.text}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">{product.orders}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => {
                            // Handle view details
                            console.log('View product details:', product.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => {
                            // Handle edit product
                            console.log('Edit product:', product.id);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => {
                            // Handle duplicate product
                            console.log('Duplicate product:', product.id);
                            // TODO: Implement GraphQL mutation for duplicating product
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600"
                          onClick={() => {
                            // Handle archive/delete product
                            if (window.confirm('Are you sure you want to archive this product?')) {
                              console.log('Archive product:', product.id);
                              // TODO: Implement GraphQL mutation for archiving product
                            }
                          }}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} products
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
  );
};

export default ProductsTable;
