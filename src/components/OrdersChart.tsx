import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const OrdersChart = () => {
  // Sample data for the last 7 days
  const ordersData = [
    { date: 'Mon', orders: 12, revenue: 2400 },
    { date: 'Tue', orders: 18, revenue: 3600 },
    { date: 'Wed', orders: 8, revenue: 1600 },
    { date: 'Thu', orders: 25, revenue: 5000 },
    { date: 'Fri', orders: 32, revenue: 6400 },
    { date: 'Sat', orders: 28, revenue: 5600 },
    { date: 'Sun', orders: 15, revenue: 3000 }
  ];

  // Sample data for monthly trends
  const monthlyData = [
    { month: 'Jan', orders: 245 },
    { month: 'Feb', orders: 312 },
    { month: 'Mar', orders: 290 },
    { month: 'Apr', orders: 178 },
    { month: 'May', orders: 389 },
    { month: 'Jun', orders: 456 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Orders & Revenue Chart */}
      <Card className="border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Orders & Revenue
          </CardTitle>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5%
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="orders"
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
                            Orders: {payload[0]?.value}
                          </p>
                          <p className="text-green-600">
                            Revenue: ₹{payload[1]?.value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  yAxisId="orders"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Orders</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Revenue (₹)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Orders Trend */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Orders Trend
          </CardTitle>
          <p className="text-sm text-gray-500">Last 6 months performance</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-blue-600">
                            Orders: {payload[0]?.value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">456</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">+17.2%</div>
              <div className="text-sm text-gray-500">vs Last Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1,870</div>
              <div className="text-sm text-gray-500">Total (6M)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersChart;