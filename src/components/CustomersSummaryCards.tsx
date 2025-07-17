import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, RotateCcw, ShoppingCart, UserPlus } from 'lucide-react';

interface CustomersSummaryCardsProps {
  onTotalCustomersClick?: () => void;
}

const CustomersSummaryCards = ({ onTotalCustomersClick }: CustomersSummaryCardsProps) => {
  const summaryStats = [
    {
      title: 'Total Customers',
      value: '25',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Return Customers', 
      value: '4',
      icon: RotateCcw,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Carts',
      value: '4', 
      icon: ShoppingCart,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'New Signups',
      value: '6',
      icon: UserPlus,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, index) => {
        const isClickable = stat.title === 'Total Customers' && onTotalCustomersClick;
        return (
          <Card 
            key={index} 
            className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
              isClickable ? 'cursor-pointer hover:scale-[1.02]' : ''
            }`}
            onClick={isClickable ? onTotalCustomersClick : undefined}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomersSummaryCards;