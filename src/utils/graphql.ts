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