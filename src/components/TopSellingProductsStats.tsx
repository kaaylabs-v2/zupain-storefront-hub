import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Star, Award, Target, Package } from 'lucide-react';

const TopSellingProductsStats = () => {
  // Sample top selling products data
  const topProducts = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      category: 'Electronics',
      sales: 342,
      revenue: 68400,
      growth: '+24.5%',
      image: '/api/placeholder/40/40',
      trending: true
    },
    {
      id: 2,
      name: 'Smart Phone Case',
      category: 'Accessories',
      sales: 256,
      revenue: 38400,
      growth: '+18.2%',
      image: '/api/placeholder/40/40',
      trending: false
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      sales: 189,
      revenue: 56700,
      growth: '+12.8%',
      image: '/api/placeholder/40/40',
      trending: true
    },
    {
      id: 4,
      name: 'Fitness Tracker',
      category: 'Health',
      sales: 167,
      revenue: 50100,
      growth: '+9.4%',
      image: '/api/placeholder/40/40',
      trending: false
    },
    {
      id: 5,
      name: 'USB-C Cable',
      category: 'Accessories',
      sales: 423,
      revenue: 21150,
      growth: '+31.7%',
      image: '/api/placeholder/40/40',
      trending: true
    }
  ];

  // Chart data for sales comparison
  const chartData = topProducts.slice(0, 5).map(product => ({
    name: product.name.split(' ').slice(0, 2).join(' '), // Shorten names for chart
    sales: product.sales,
    revenue: product.revenue / 1000 // Convert to thousands
  }));

  // Calculate totals
  const totalSales = topProducts.reduce((sum, product) => sum + product.sales, 0);
  const totalRevenue = topProducts.reduce((sum, product) => sum + product.revenue, 0);
  const avgOrderValue = totalRevenue / totalSales;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalSales}</div>
            <div className="text-sm text-gray-500">Total Units Sold</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">₹{(totalRevenue / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">₹{avgOrderValue.toFixed(0)}</div>
            <div className="text-sm text-gray-500">Avg. Order Value</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{topProducts.filter(p => p.trending).length}</div>
            <div className="text-sm text-gray-500">Trending Products</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    #{index + 1}
                  </div>
                  
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                      {product.trending && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{product.sales} sold</div>
                    <div className="text-sm text-green-600">₹{(product.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">{product.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    yAxisId="sales"
                    orientation="left"
                    stroke="#3b82f6"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-blue-600">
                              Sales: {payload[0]?.value} units
                            </p>
                            <p className="text-green-600">
                              Revenue: ₹{payload[1]?.value}K
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    yAxisId="sales"
                    dataKey="sales" 
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                    name="Sales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Legend */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Units Sold</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Best Performer</h4>
              <p className="text-sm text-blue-700">
                <strong>{topProducts[0].name}</strong> leads with {topProducts[0].sales} units sold
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Highest Revenue</h4>
              <p className="text-sm text-green-700">
                <strong>Wireless Headphones Pro</strong> generated ₹{(topProducts[0].revenue / 1000).toFixed(0)}K revenue
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Growth Leader</h4>
              <p className="text-sm text-purple-700">
                <strong>USB-C Cable</strong> showing {topProducts[4].growth} growth this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopSellingProductsStats;