
import React from 'react';
import { Calendar, User, CreditCard, Package, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrders } from '@/hooks/useOrders';
import { OrderFilter } from '@/utils/graphql';

interface OrdersTimelineProps {
  activeFilter: string;
}

const OrdersTimeline = ({ activeFilter }: OrdersTimelineProps) => {
  // Helper function to map filter status to GraphQL type
  const mapFilterStatus = (filter: string): OrderFilter['status'] | undefined => {
    const statusMap: Record<string, OrderFilter['status']> = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'in-packing': 'InPacking',
      'dispatched': 'Dispatched',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'checkout': 'Checkout',
      'cancel-request': 'CancelRequest'
    };
    return statusMap[filter.toLowerCase()];
  };

  // Create filter object for GraphQL
  const filter: OrderFilter = activeFilter !== 'all' ? { 
    status: mapFilterStatus(activeFilter)
  } : {};

  // Use GraphQL hook for data fetching
  const { orders, loading, error, refetch, usingMockData } = useOrders(
    100, // Get more orders for timeline view
    0,   // Start from beginning
    filter
  );

  // Filter orders based on active filter (already handled by GraphQL filter, but keeping for consistency)
  const filteredOrders = orders || [];

  // Group orders by date for timeline
  const groupedByDate = filteredOrders.reduce((acc, order) => {
    const date = order.billDate.split(' ').slice(0, 3).join(' '); // Extract date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {} as Record<string, typeof orders>);

  const dateKeys = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg border p-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-600">Loading timeline...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state (only show for real errors, not when using mock data)
  if (error && !usingMockData) {
    return (
      <div className="space-y-8">
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            Failed to load orders timeline: {error}
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

  return (
    <div className="space-y-8">
      {/* Mock Data Indicator */}
      {usingMockData && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800 text-sm">
            📋 Currently displaying sample timeline data - GraphQL endpoint not connected
          </AlertDescription>
        </Alert>
      )}

      {dateKeys.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-lg">No orders found for the selected filter.</p>
          <Button 
            variant="outline" 
            onClick={refetch}
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {dateKeys.map((date, dateIndex) => (
            <div key={date} className="relative">
              {/* Date Header */}
              <div className="flex items-center mb-6">
                <div className="relative z-10 bg-blue-500 rounded-full p-3 mr-6">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <h3 className="font-semibold text-blue-900">{date}</h3>
                  <p className="text-sm text-blue-600">{groupedByDate[date].length} orders</p>
                </div>
              </div>

              {/* Orders for this date */}
              <div className="ml-20 space-y-4 mb-8">
                {groupedByDate[date].map((order, orderIndex) => (
                  <div key={order.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-16 top-4 w-4 h-4 ${order.timelineColor} rounded-full border-4 border-white shadow-md`}></div>
                    
                    {/* Order Card */}
                    <Card className="hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-semibold text-blue-600 text-lg">{order.id}</h4>
                              <p className="text-sm text-gray-500">{order.billDate.split(' ').slice(3).join(' ')}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className={order.statusColor}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* Customer */}
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{order.customer}</span>
                          </div>

                          {/* Payment Method */}
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{order.paymentMethod}</span>
                          </div>

                          {/* Amount */}
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900">{order.amount}</span>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Package className="w-4 h-4 text-gray-400" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="w-4 h-4 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTimeline;
