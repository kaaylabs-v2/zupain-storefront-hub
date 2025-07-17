import React from 'react';
import CustomersTable from '@/components/CustomersTable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, ShoppingCart, TrendingUp } from 'lucide-react';

interface CustomersContentProps {
  viewMode: 'table' | 'cards';
}

const CustomersContent = ({ viewMode }: CustomersContentProps) => {

  const customersData = [
    {
      id: 1,
      name: "Khushboo",
      initial: "K",
      type: "Return Customer",
      mobile: "+91 9157101975",
      totalOrders: 8,
      totalSales: "₹3,303.00",
      totalSalesValue: 3303,
      totalCart: 0
    },
    {
      id: 2,
      name: "",
      initial: "",
      type: "New Customer(Signed IN)",
      mobile: "6363618762",
      totalOrders: 0,
      totalSales: "₹0.00",
      totalSalesValue: 0,
      totalCart: "1 items"
    },
    {
      id: 3,
      name: "skc",
      initial: "S",
      type: "Return Customer",
      mobile: "91 8849626093",
      totalOrders: 5,
      totalSales: "₹5.00",
      totalSalesValue: 5,
      totalCart: 0
    },
    {
      id: 4,
      name: "skc",
      initial: "S",
      type: "Return Customer",
      mobile: "91 8124001125",
      totalOrders: 2,
      totalSales: "₹1,600.00",
      totalSalesValue: 1600,
      totalCart: 0
    },
    {
      id: 5,
      name: "Riya",
      initial: "R",
      type: "Return Customer",
      mobile: "91 9236084106",
      totalOrders: 2,
      totalSales: "₹2.00",
      totalSalesValue: 2,
      totalCart: "1 items"
    },
    {
      id: 6,
      name: "ABHA",
      initial: "A",
      type: "New Customer(Signed IN)",
      mobile: "91 9727776523",
      totalOrders: 1,
      totalSales: "₹1.00",
      totalSalesValue: 1,
      totalCart: "1 items"
    }
  ];

  const getCustomerTypeColor = (type: string) => {
    if (type === "Return Customer") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {customersData.map((customer) => (
        <Card key={customer.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-lg">
                      {customer.initial || customer.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  {customer.type === "Return Customer" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{customer.name || "Anonymous"}</h3>
                  <p className="text-xs text-gray-500">ID: {customer.id}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Badge 
                variant="outline" 
                className={`${getCustomerTypeColor(customer.type)} font-medium border w-full justify-center`}
              >
                {customer.type}
              </Badge>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-mono">{customer.mobile}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Orders</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{customer.totalOrders}</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-gray-500">Revenue</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{customer.totalSales}</span>
                </div>
              </div>
              
              {typeof customer.totalCart === 'string' && (
                <div className="pt-2 border-t border-gray-100">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 w-full justify-center">
                    Cart: {customer.totalCart}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      {viewMode === 'cards' ? renderCardsView() : <CustomersTable />}
    </div>
  );
};

export default CustomersContent;