import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Package, Target } from 'lucide-react';

const ProductsSidebar = () => {
  const topProducts = [
    {
      id: 1,
      name: 'Blameless Hydrating Serum',
      sales: 234,
      revenue: 23400,
      growth: '+24.5%',
      trending: true
    },
    {
      id: 2,
      name: 'Avocado Sunscreen SPF 50',
      sales: 445,
      revenue: 33375,
      growth: '+18.2%',
      trending: true
    },
    {
      id: 3,
      name: 'Vitamin C Face Wash',
      sales: 567,
      revenue: 39690,
      growth: '+12.8%',
      trending: false
    },
    {
      id: 4,
      name: 'Omega-3 Fish Oil',
      sales: 678,
      revenue: 81222,
      growth: '+31.7%',
      trending: true
    }
  ];

  const totalSales = topProducts.reduce((sum, product) => sum + product.sales, 0);
  const totalRevenue = topProducts.reduce((sum, product) => sum + product.revenue, 0);

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-4 w-4" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Sales</span>
            <span className="font-semibold">{totalSales}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Revenue</span>
            <span className="font-semibold text-green-600">₹{(totalRevenue / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Trending</span>
            <span className="font-semibold text-blue-600">{topProducts.filter(p => p.trending).length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-4 w-4" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {topProducts.slice(0, 4).map((product, index) => (
              <div key={product.id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-xs">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    {product.trending && (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{product.sales} sold</span>
                    <span className="text-xs text-green-600">{product.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Alert */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-4 w-4" />
            Inventory Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Stock</span>
              <Badge variant="destructive" className="text-xs">3 items</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <Badge variant="secondary" className="text-xs">1 item</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reorder Point</span>
              <Badge variant="outline" className="text-xs">5 items</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsSidebar;