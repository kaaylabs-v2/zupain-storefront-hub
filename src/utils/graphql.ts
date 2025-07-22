// GraphQL queries and types for product data

export const GET_PRODUCTS = `
query Products($limit: Int, $offset: Int) {
    products(limit: $limit, offset: $offset) {
        tenant {
            name
            uid
        }
        data {
            product_id
            product_uid
            product_name
            price
            images {
                product_image
                product_uid
            }
        }
        pagination {
            page
            limit
            total
            totalPages
        }
    }
}`


// export const GET_PRODUCTS = `
// query FindAllProducts {
//     findAllProducts(tenant_uid: "bc9023f8-2759-4988-a2ca-d579178be10c") {
//         product_id
//         product_uid
//         product_name
//         category_uid
//         track_inventory
//         price
//         category {
//             category_uid
//             category_name
//         }
//        product_images {
//             product_image
//             product_uid
//         }
//     }
// }
// `;


// query GetProducts($limit: Int, $offset: Int, $filter: ProductFilter) {
//     products(limit: $limit, offset: $offset, filter: $filter) {
//       data {
//         id
//         name
//         description
//         sku
//         category {
//           id
//           name
//         }
//         price
//         inventory
//         status
//         rating
//         totalOrders
//         images {
//           url
//           alt
//         }
//         createdAt
//         updatedAt
//       }
//       pagination {
//         total
//         limit
//         offset
//         hasNextPage
//         hasPreviousPage
//       }
//     }
//   }

export const GET_PRODUCT_BY_ID = `
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      description
      sku
      category {
        id
        name
      }
      price
      inventory
      status
      rating
      totalOrders
      images {
        url
        alt
      }
      variants {
        id
        name
        price
        inventory
        sku
      }
      seo {
        title
        description
        keywords
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_SUMMARY = `
  query GetProductsSummary {
    productsSummary {
      total
      active
      draft
      archived
      lowStock
      outOfStock
    }
  }
`;

export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $limit: Int, $offset: Int) {
    searchProducts(query: $query, limit: $limit, offset: $offset) {
      data {
        id
        name
        description
        sku
        category {
          name
        }
        price
        inventory
        status
        rating
        images {
          url
          alt
        }
      }
      pagination {
        total
        limit
        offset
      }
    }
  }
`;

// Orders GraphQL Queries
export const GET_ORDERS = `
  query Orders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      data {
        order_hdr_id
        order_id
        order_notes
        order_price
        creation_date
        user {
                user_uid
                user_name
                user_email
                user_mobile
            }
        delivery_address {
            state
            city
            address_line_2
            address_line_1
            pincode
        }
         order_details {
                order_uid
                product_uid
        }
        milestone {
            milestone_description
        }
        order_payment {
        payment_mode
        transaction_uid
        order_payment_id
        payment_method {
            method_name
        }
       }
      }
    }
  }
`;

// export const GET_ORDERS = `
//   query Orders($limit: Int, $offset: Int, $filter: OrderFilter) {
//     orders(limit: $limit, offset: $offset, filter: $filter) {
//       data {
//         id
//         customer {
//           name
//           email
//           phone
//         }
//         billDate
//         status
//         paymentMethod
//         amount
//         currency
//         items
//         address {
//           street
//           city
//           state
//           postalCode
//           country
//         }
//         trackingNumber
//         notes
//         createdAt
//         updatedAt
//       }
//       pagination {
//         total
//         limit
//         offset
//         hasNextPage
//         hasPreviousPage
//       }
//     }
//   }
// `;

export const GET_ORDER_BY_ID = `
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      customer {
        name
        email
        phone
      }
      billDate
      status
      paymentMethod
      amount
      currency
      items
      address {
        street
        city
        state
        postalCode
        country
      }
      trackingNumber
      notes
      orderItems {
        id
        product {
          id
          name
          sku
          image
        }
        quantity
        price
        total
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDERS_SUMMARY = `
  query GetOrderStats {
    orderStats {
    success
    data {
      total
      cancelled
      checkout
      confirmed
      inPacking
      delivered
      dispatched
      pending
      cancelRequest
      PreparingForDispatch
    }
    tenant_uid
  }
  }
`;

export const SEARCH_ORDERS = `
  query SearchOrders($query: String!, $limit: Int, $offset: Int) {
    searchOrders(query: $query, limit: $limit, offset: $offset) {
      data {
        id
        customer {
          name
          email
          phone
        }
        billDate
        status
        paymentMethod
        amount
        currency
        items
        createdAt
      }
      pagination {
        total
        limit
        offset
      }
    }
  }
`;

// TypeScript types for the GraphQL responses
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  inventory: number;
  status: 'Active' | 'Draft' | 'Archived';
  rating: number;
  orders: number;
  totalOrders: number;
  image: string;
  images: {
    url: string;
    alt: string;
  }[];
  variants?: ProductVariant[];
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
  sku: string;
}

export interface ProductsResponse {
  products: {
    data: Product[];
    findAllProducts: Product[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface ProductFilter {
  category?: string;
  status?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inventory?: {
    min: number;
    max: number;
  };
}

// Order types
export interface Order {
  id: string;
  customer: string;
  billDate: string;
  status: 'Pending' | 'Confirmed' | 'InPacking' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Checkout' | 'CancelRequest';
  paymentMethod: string;
  amount: string;
  items: number;
  address: string;
  phone: string;
  email: string;
  statusColor: string;
}

export interface OrdersResponse {
  orders: {
    data: Order[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface OrderFilter {
  status?: 'Pending' | 'Confirmed' | 'InPacking' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Checkout' | 'CancelRequest';
  paymentMethod?: string;
  customer?: string;
  amountRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
}

// GraphQL client configuration
export const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.example.com/graphql';

export const graphqlRequest = async (query: string, variables?: any) => {
    console.log("query", query, variables);
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
}; 

// Categories GraphQL Queries
export const GET_CATEGORIES = `
  query Categories($limit: Int, $offset: Int, $filter: CategoryFilterInput) {
    categories(limit: $limit, offset: $offset, filter: $filter) {
      data {
        category_id
        category_uid
        category_name
        is_active
        banner_image
        creation_date
        modified_date
        products_count
      }
      pagination {
        total
        limit
        page
        totalPages
      }
    }
  }
`;


// query Categories($limit: Int, $offset: Int) {
//   categories(limit: $limit, offset: $offset) {
//     data {
//       category_id
//       category_uid
//       category_name
//       category_status
//       product_count
//       category_image
//       created_at
//       updated_at
//     }
//     pagination {
//       total
//       limit
//       offset
//       page
//       totalPages
//       hasNextPage
//       hasPreviousPage
//     }
//   }
// }

export const GET_CATEGORY_BY_ID = `
  query GetCategoryById($id: ID!) {
    category(id: $id) {
      id
      name
      status
      products
      image
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES_SUMMARY = `
  query GetCategoriesSummary {
    categoriesSummary {
    data {
      total           # Total categories
      active          # Active categories  
      inactive        # Inactive categories
      totalProducts   # Total products across all categories
      lastUpdated     # Last updated timestamp
}
    }
  }
`;

export const SEARCH_CATEGORIES = `
  query SearchCategories($query: String!, $limit: Int, $offset: Int) {
    searchCategories(query: $query, limit: $limit, offset: $offset) {
      data {
        id
        name
        status
        products
        image
      }
      pagination {
        total
        limit
        offset
      }
    }
  }
`;

// Category types
export interface Category {
  id: string;
  name: string;
  status: boolean;
  products: number;
  image: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  categories: {
    data: Category[];
    pagination: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
    };
  };
}

export interface CategoryFilter {
  status?: boolean | null; // null for all, true for active, false for inactive
  name?: string;
  type?: string;
  searchQuery?: string;
} 