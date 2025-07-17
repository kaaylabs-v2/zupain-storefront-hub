import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, DollarSign, ShoppingBag, User, Package } from 'lucide-react';

interface AbandonedCart {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  lastActivity: string;
  totalValue: number;
  itemCount: number;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }[];
}

interface AbandonedCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AbandonedCartModal: React.FC<AbandonedCartModalProps> = ({ isOpen, onClose }) => {
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);

  // Sample abandoned cart data
  const abandonedCarts: AbandonedCart[] = [
    {
      id: 'CART-001',
      customerId: 'CUST-123',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      createdAt: '2024-01-15T10:30:00Z',
      lastActivity: '2024-01-15T11:45:00Z',
      totalValue: 2450,
      itemCount: 3,
      products: [
        {
          id: 'PROD-001',
          name: 'Wireless Headphones',
          price: 1200,
          quantity: 1,
          image: '/api/placeholder/60/60',
          variant: 'Black'
        },
        {
          id: 'PROD-002',
          name: 'Phone Case',
          price: 450,
          quantity: 2,
          image: '/api/placeholder/60/60',
          variant: 'Clear'
        },
        {
          id: 'PROD-003',
          name: 'Screen Protector',
          price: 350,
          quantity: 1,
          image: '/api/placeholder/60/60'
        }
      ]
    },
    {
      id: 'CART-002',
      customerId: 'CUST-456',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@email.com',
      createdAt: '2024-01-14T15:20:00Z',
      lastActivity: '2024-01-14T16:10:00Z',
      totalValue: 3200,
      itemCount: 2,
      products: [
        {
          id: 'PROD-004',
          name: 'Smart Watch',
          price: 2800,
          quantity: 1,
          image: '/api/placeholder/60/60',
          variant: 'Silver'
        },
        {
          id: 'PROD-005',
          name: 'Watch Band',
          price: 400,
          quantity: 1,
          image: '/api/placeholder/60/60',
          variant: 'Leather Brown'
        }
      ]
    },
    {
      id: 'CART-003',
      customerId: 'CUST-789',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.johnson@email.com',
      createdAt: '2024-01-13T09:15:00Z',
      lastActivity: '2024-01-13T09:45:00Z',
      totalValue: 1850,
      itemCount: 4,
      products: [
        {
          id: 'PROD-006',
          name: 'Bluetooth Speaker',
          price: 800,
          quantity: 1,
          image: '/api/placeholder/60/60'
        },
        {
          id: 'PROD-007',
          name: 'Cable Set',
          price: 250,
          quantity: 3,
          image: '/api/placeholder/60/60'
        },
        {
          id: 'PROD-008',
          name: 'Power Bank',
          price: 550,
          quantity: 1,
          image: '/api/placeholder/60/60'
        }
      ]
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const handleClose = () => {
    setSelectedCart(null);
    onClose();
  };

  if (selectedCart) {
    // Cart Detail View
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCart(null)}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl font-semibold">
                Cart Details - {selectedCart.id}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedCart.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedCart.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(selectedCart.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Activity</p>
                    <p className="font-medium">{getTimeAgo(selectedCart.lastActivity)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Cart Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedCart.itemCount}</div>
                    <div className="text-sm text-gray-500">Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{selectedCart.totalValue}</div>
                    <div className="text-sm text-gray-500">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">₹{Math.round(selectedCart.totalValue / selectedCart.itemCount)}</div>
                    <div className="text-sm text-gray-500">Avg. Item Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products in Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products in Cart ({selectedCart.products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCart.products.map((product, index) => (
                    <div key={product.id}>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          {product.variant && (
                            <p className="text-sm text-gray-500">Variant: {product.variant}</p>
                          )}
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                            <span className="text-sm font-medium">₹{product.price} each</span>
                            <span className="text-lg font-semibold text-green-600">
                              ₹{product.price * product.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < selectedCart.products.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline">
                Send Reminder Email
              </Button>
              <Button variant="outline">
                Create Discount Code
              </Button>
              <Button>
                Contact Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Cart List View
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            Abandoned Carts ({abandonedCarts.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{abandonedCarts.length}</div>
                <div className="text-sm text-gray-500">Total Carts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{abandonedCarts.reduce((sum, cart) => sum + cart.totalValue, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {abandonedCarts.reduce((sum, cart) => sum + cart.itemCount, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Items</div>
              </CardContent>
            </Card>
          </div>

          {/* Cart List */}
          <div className="space-y-3">
            {abandonedCarts.map((cart) => (
              <Card 
                key={cart.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCart(cart)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{cart.id}</h4>
                        <p className="text-sm text-gray-500">{cart.customerName}</p>
                        <p className="text-xs text-gray-400">{cart.customerEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Items</p>
                          <p className="font-medium">{cart.itemCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Value</p>
                          <p className="font-medium text-green-600">₹{cart.totalValue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Activity</p>
                          <p className="font-medium">{getTimeAgo(cart.lastActivity)}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          View Details
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AbandonedCartModal;