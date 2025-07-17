
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, ShoppingBag } from 'lucide-react';
import AbandonedCartModal from './AbandonedCartModal';

const DashboardStats = () => {
  const navigate = useNavigate();
  const [isAbandonedCartModalOpen, setIsAbandonedCartModalOpen] = useState(false);
  const statsCards = [
    {
      title: 'Total Orders',
      value: '0',
      change: '+100.00%',
      trend: 'up',
      icon: ShoppingCart,
      timeframe: 'Last Week'
    },
    {
      title: 'Total Sales',
      value: '0',
      change: '+100.00%',
      trend: 'up', 
      icon: DollarSign,
      timeframe: 'Last Week'
    },
    {
      title: 'Abandoned Carts',
      value: '23',
      change: '+15.2%',
      trend: 'up',
      icon: ShoppingBag,
      timeframe: 'Last Week',
      clickable: true,
      onClick: () => setIsAbandonedCartModalOpen(true)
    },
    {
      title: 'Total User Visits',
      value: '5531',
      todayVisits: '0',
      icon: Eye,
      timeframe: 'Today Visits vs Total Visits'
    }
  ];

  const quickStats = [
    { 
      label: 'Categories', 
      value: '2', 
      clickable: true, 
      onClick: () => navigate('/categories') 
    },
    { 
      label: 'Sub Categories', 
      value: '0' 
    },
    { 
      label: 'Total Products', 
      value: '4', 
      clickable: true, 
      onClick: () => navigate('/products') 
    },
    { 
      label: 'All Customers', 
      value: '18', 
      clickable: true, 
      onClick: () => navigate('/customers') 
    },
    { 
      label: 'Avg. Order Value', 
      value: '0', 
      suffix: '.00%' 
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card 
              key={index} 
              className={`border border-gray-200 hover:shadow-lg transition-shadow ${
                stat.clickable ? 'cursor-pointer hover:border-blue-300' : ''
              }`}
              onClick={stat.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                  {stat.clickable && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      View Details
                    </Badge>
                  )}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.todayVisits !== undefined && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Today: {stat.todayVisits}
                      </span>
                    )}
                  </div>
                  {stat.change && (
                    <div className="flex items-center space-x-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{stat.timeframe}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickStats.map((stat, index) => (
            <Card 
              key={index} 
              className={`border border-gray-200 ${
                stat.clickable ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all' : ''
              }`}
              onClick={stat.onClick}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
                  {stat.label}
                  {stat.clickable && (
                    <Badge variant="secondary" className="text-xs">
                      View
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Abandoned Cart Modal */}
      <AbandonedCartModal
        isOpen={isAbandonedCartModalOpen}
        onClose={() => setIsAbandonedCartModalOpen(false)}
      />
    </>
  );
};

export default DashboardStats;
