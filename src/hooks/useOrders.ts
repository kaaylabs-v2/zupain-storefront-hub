import { useState, useEffect } from 'react';
import { 
  GET_ORDERS, 
  GET_ORDER_BY_ID, 
  GET_ORDERS_SUMMARY,
  SEARCH_ORDERS,
  graphqlRequest,
  Order,
  OrdersResponse,
  OrderFilter
} from '@/utils/graphql';

// Define interfaces for better type safety
interface OrderItemData {
  order_id: string;
  user?: {
    user_name?: string;
    user_mobile?: string;
    user_email?: string;
  };
  customer?: string;
  creation_date: string;
  milestone?: {
    milestone_description: string;
  };
  order_payment?: {
    payment_method?: {
      method_name: string;
    };
  };
  order_price?: number;
  order_details?: unknown[];
  delivery_address?: {
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

interface RefetchOrderItemData {
  id: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  } | string;
  billDate: string;
  status: string;
  paymentMethod: string;
  amount?: number;
  items: number;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const useOrders = (
  limit: number = 10,
  offset: number = 0,
  filter?: OrderFilter
) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 0,
    offset: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data: OrdersResponse = await graphqlRequest(GET_ORDERS, {
          limit,
          offset,
          filter
        });

        console.log("orders--->",data);

        if (!isMounted) return;

        const transformedOrders = data?.orders?.data?.map((item: OrderItemData) =>{
            const addressLine1 = item.delivery_address?.address_line_1;
            const addressLine2 = item.delivery_address?.address_line_2;
            const city = item.delivery_address?.city;
            const state = item.delivery_address?.state;
            const pincode = item.delivery_address?.pincode;
            const addressLine1Exists = addressLine1 ? `${addressLine1},` : "";
            const addressLine2Exists = addressLine2 ? `${addressLine2},` : "";
            const address = `${addressLine1Exists} ${addressLine2Exists} ${city}, ${state} ${pincode}`;
            return ({
          id: item.order_id,
          customer: item.user?.user_name || item.customer,
          billDate: item.creation_date,
          status: item.milestone?.milestone_description,
          paymentMethod: item.order_payment?.payment_method?.method_name,
          amount: `₹${item?.order_price?.toLocaleString()}.00`,
          items: item.order_details?.length,
          address: address,
          phone: item.user?.user_mobile,
          email: item.user?.user_email,
          statusColor: getStatusColor(item?.milestone?.milestone_description)
        })});
        
        setOrders(transformedOrders);
        const paginationData = data.orders.pagination;
        setPagination({
          total: paginationData?.total,
          limit: paginationData?.limit,
          offset: offset,
          hasNextPage: paginationData?.hasNextPage,
          hasPreviousPage: paginationData?.hasPreviousPage
        });
        setUsingMockData(false);
      } catch (err) {
        if (!isMounted) return;
        
        console.warn('GraphQL orders request failed, using mock data:', err);
        
        // If GraphQL fails, use mock data for development
        const mockOrders = getMockOrders();
        const filteredMockOrders = filter?.status 
          ? mockOrders.filter(order => order.status.toLowerCase() === filter.status?.toLowerCase())
          : mockOrders;
        
        setOrders(filteredMockOrders.slice(offset, offset + limit));
        setPagination({
          total: filteredMockOrders.length,
          limit: limit,
          offset: offset,
          hasNextPage: offset + limit < filteredMockOrders.length,
          hasPreviousPage: offset > 0
        });
        
        setUsingMockData(true);
        setError('Using mock data - GraphQL endpoint not available');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce the API call to prevent excessive requests
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [limit, offset, JSON.stringify(filter)]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data: OrdersResponse = await graphqlRequest(GET_ORDERS, {
        limit,
        offset,
        filter
      });

      const transformedOrders = data?.orders?.data?.map((item: Order) => ({
        id: item.id,
        customer: typeof item.customer === 'string' ? item.customer : item.customer?.name,
        billDate: item.billDate,
        status: item.status as "Pending" | "Confirmed" | "InPacking" | "Dispatched" | "Delivered" | "Cancelled" | "Checkout" | "CancelRequest",
        paymentMethod: item.paymentMethod,
        amount: `₹${Number(item.amount).toLocaleString()}.00`,
        items: item.items,
        address: `${item.address?.street}, ${item.address?.city}, ${item.address?.state} ${item.address?.postalCode}`,
        phone: typeof item.customer === 'string' ? null : item.customer?.phone,
        email: typeof item.customer === 'string' ? null : item.customer?.email,
        statusColor: getStatusColor(item.status)
      }));
      
      setOrders(transformedOrders);
      const paginationData = data.orders.pagination;
      setPagination({
        total: paginationData.total,
        limit: paginationData.limit,
        offset: offset,
        hasNextPage: paginationData.hasNextPage,
        hasPreviousPage: paginationData.hasPreviousPage
      });
      setUsingMockData(false);
    } catch (err) {
      console.warn('GraphQL orders refetch failed, using mock data:', err);
      
      // If GraphQL fails, use mock data for development
      const mockOrders = getMockOrders();
      const filteredMockOrders = filter?.status 
        ? mockOrders.filter(order => order.status.toLowerCase() === filter.status?.toLowerCase())
        : mockOrders;
      
      setOrders(filteredMockOrders.slice(offset, offset + limit));
      setPagination({
        total: filteredMockOrders.length,
        limit: limit,
        offset: offset,
        hasNextPage: offset + limit < filteredMockOrders.length,
        hasPreviousPage: offset > 0
      });
      
      setUsingMockData(true);
      setError('Using mock data - GraphQL endpoint not available');
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    pagination,
    refetch,
    usingMockData
  };
};

export const useOrdersSearch = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 0,
    offset: 0
  });

  const search = async (query: string, limit: number = 10, offset: number = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(SEARCH_ORDERS, {
        query,
        limit,
        offset
      });
      
      setOrders(data.searchOrders.data);
      setPagination(data.searchOrders.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    pagination,
    search
  };
};

export const useOrdersSummary = () => {
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    inPacking: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0,
    checkout: 0,
    cancelRequest: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(GET_ORDERS_SUMMARY);

      console.log("ordersSummary--->",data);
      setSummary(data.orderStats.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
};

// Helper functions
const getStatusColor = (status: string) => {
  const statusColorMap: Record<string, string> = {
    'Pending': 'bg-orange-100 text-orange-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'InPacking': 'bg-purple-100 text-purple-800',
    'Dispatched': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Checkout': 'bg-gray-100 text-gray-800',
    'CancelRequest': 'bg-yellow-100 text-yellow-800'
  };
  return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};

// Mock data for development when GraphQL is not available
const getMockOrders = (): Order[] => {
  return [
    {
      id: 'ORID0056',
      customer: 'Jaya Khubani',
      billDate: 'May 11, 2025 9:25 PM',
      status: 'Cancelled',
      paymentMethod: 'Cod',
      amount: '₹749.00',
      statusColor: 'bg-red-100 text-red-800',
      items: 3,
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      phone: '+91 9876543210',
      email: 'jaya.khubani@email.com'
    },
    {
      id: 'ORID0055',
      customer: 'Khushboo',
      billDate: 'May 11, 2025 9:19 PM',
      status: 'Delivered',
      paymentMethod: 'Cod',
      amount: '₹2,298.00',
      statusColor: 'bg-green-100 text-green-800',
      items: 5,
      address: '456 Park Avenue, Delhi, Delhi 110001',
      phone: '+91 9876543211',
      email: 'khushboo@email.com'
    },
    {
      id: 'ORID0054',
      customer: 'Sitaben',
      billDate: 'May 11, 2025 12:40 PM',
      status: 'Delivered',
      paymentMethod: 'Cod',
      amount: '₹850.00',
      statusColor: 'bg-green-100 text-green-800',
      items: 2,
      address: '789 Garden Road, Pune, Maharashtra 411001',
      phone: '+91 9876543212',
      email: 'sitaben@email.com'
    },
    {
      id: 'ORID0053',
      customer: 'Setu',
      billDate: 'May 10, 2025 2:09 PM',
      status: 'Delivered',
      paymentMethod: 'Cod',
      amount: '₹850.00',
      statusColor: 'bg-green-100 text-green-800',
      items: 2,
      address: '321 Lake View, Bangalore, Karnataka 560001',
      phone: '+91 9876543213',
      email: 'setu@email.com'
    },
    {
      id: 'ORID0052',
      customer: 'Mukesh Kumar',
      billDate: 'May 10, 2025 1:54 PM',
      status: 'Delivered',
      paymentMethod: 'Cod',
      amount: '₹850.00',
      statusColor: 'bg-green-100 text-green-800',
      items: 2,
      address: '654 Hill Station, Chennai, Tamil Nadu 600001',
      phone: '+91 9876543214',
      email: 'mukesh.kumar@email.com'
    },
    {
      id: 'ORID0051',
      customer: 'Shital',
      billDate: 'May 10, 2025 1:51 PM',
      status: 'Delivered',
      paymentMethod: 'Cod',
      amount: '₹999.00',
      statusColor: 'bg-green-100 text-green-800',
      items: 3,
      address: '987 Valley Road, Hyderabad, Telangana 500001',
      phone: '+91 9876543215',
      email: 'shital@email.com'
    },
    {
      id: 'ORID0050',
      customer: 'Kamlesh',
      billDate: 'May 10, 2025 1:44 PM',
      status: 'Delivered',
      paymentMethod: 'Cod',
      amount: '₹850.00',
      statusColor: 'bg-green-100 text-green-800',
      items: 2,
      address: '147 River Side, Kolkata, West Bengal 700001',
      phone: '+91 9876543216',
      email: 'kamlesh@email.com'
    },
    {
      id: 'ORID0049',
      customer: 'Khushboo',
      billDate: 'May 9, 2025 12:18 PM',
      status: 'Cancelled',
      paymentMethod: 'Cod',
      amount: '₹1.00',
      statusColor: 'bg-red-100 text-red-800',
      items: 1,
      address: '456 Park Avenue, Delhi, Delhi 110001',
      phone: '+91 9876543211',
      email: 'khushboo@email.com'
    },
    {
      id: 'ORID0048',
      customer: 'Khushboo',
      billDate: 'April 27, 2025 5:43 PM',
      status: 'Cancelled',
      paymentMethod: 'Razorpay',
      amount: '₹999.00',
      statusColor: 'bg-red-100 text-red-800',
      items: 3,
      address: '456 Park Avenue, Delhi, Delhi 110001',
      phone: '+91 9876543211',
      email: 'khushboo@email.com'
    },
  ];
}; 