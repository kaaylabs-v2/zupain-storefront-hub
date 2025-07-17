import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Star, TrendingUp, Crown, DollarSign, ShoppingBag, Calendar, Award } from 'lucide-react';

const TopCustomersStats = () => {
  // Sample top customers data
  const topCustomers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      totalSpent: 125400,
      orders: 47,
      avgOrderValue: 2668,
      status: 'VIP',
      joinDate: '2023-01-15',
      lastOrder: '2024-01-10',
      growth: '+34.2%',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      totalSpent: 98600,
      orders: 32,
      avgOrderValue: 3081,
      status: 'Premium',
      joinDate: '2023-03-22',
      lastOrder: '2024-01-08',
      growth: '+28.7%',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      totalSpent: 87300,
      orders: 29,
      avgOrderValue: 3010,
      status: 'Premium',
      joinDate: '2023-02-10',
      lastOrder: '2024-01-05',
      growth: '+22.1%',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      totalSpent: 72800,
      orders: 41,
      avgOrderValue: 1776,
      status: 'Regular',
      joinDate: '2023-05-08',
      lastOrder: '2024-01-12',
      growth: '+19.5%',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      totalSpent: 65900,
      orders: 25,
      avgOrderValue: 2636,
      status: 'Premium',
      joinDate: '2023-04-18',
      lastOrder: '2024-01-07',
      growth: '+16.8%',
      avatar: '/api/placeholder/40/40'
    }
  ];

  // Customer segments data for pie chart
  const customerSegments = [
    { name: 'VIP', value: 15, color: '#8b5cf6' },
    { name: 'Premium', value: 45, color: '#3b82f6' },
    { name: 'Regular', value: 120, color: '#10b981' },
    { name: 'New', value: 67, color: '#f59e0b' }
  ];

  // Monthly customer acquisition data
  const acquisitionData = [
    { month: 'Jul', customers: 23 },
    { month: 'Aug', customers: 32 },
    { month: 'Sep', customers: 28 },
    { month: 'Oct', customers: 45 },
    { month: 'Nov', customers: 38 },
    { month: 'Dec', customers: 52 }
  ];

  // Calculate totals
  const totalSpent = topCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = topCustomers.reduce((sum, customer) => sum + customer.orders, 0);
  const avgCustomerValue = totalSpent / topCustomers.length;
  const totalCustomers = customerSegments.reduce((sum, segment) => sum + segment.value, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Regular': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VIP': return <Crown className="h-3 w-3" />;
      case 'Premium': return <Star className="h-3 w-3" />;
      case 'Regular': return <Users className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-gray-900">{totalCustomers}</div>
            <div className="text-xs text-gray-500">Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-bold text-green-600">₹{(totalSpent / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers - Compact List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4" />
            Top Customers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {topCustomers.slice(0, 3).map((customer, index) => (
              <div key={customer.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs">
                  #{index + 1}
                </div>
                
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{customer.name}</h4>
                    <Badge className={`text-xs px-1 py-0 ${getStatusColor(customer.status)}`}>
                      {getStatusIcon(customer.status)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">
                    {customer.orders} orders • ₹{(customer.avgOrderValue / 1000).toFixed(1)}K avg
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm">₹{(customer.totalSpent / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-green-600">{customer.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments - Compact Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            Segments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-lg">
                          <p className="font-medium text-gray-900 text-xs">{data.name}</p>
                          <p className="text-xs text-gray-600">{data.value} customers</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Compact Legend */}
          <div className="grid grid-cols-2 gap-1 mt-2">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="flex items-center text-xs">
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-gray-600">{segment.name}: {segment.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="p-2 bg-purple-50 rounded-md">
              <h4 className="font-medium text-purple-900 text-xs flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Top Spender
              </h4>
              <p className="text-xs text-purple-700">
                {topCustomers[0].name} - ₹{(topCustomers[0].totalSpent / 1000).toFixed(0)}K
              </p>
            </div>
            
            <div className="p-2 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-900 text-xs flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Growth Leader
              </h4>
              <p className="text-xs text-green-700">
                {topCustomers[0].name} - {topCustomers[0].growth}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopCustomersStats;