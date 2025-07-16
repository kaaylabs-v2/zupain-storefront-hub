import { useState, useEffect } from 'react';
import { 
  GET_PRODUCTS, 
  GET_PRODUCT_BY_ID, 
  GET_PRODUCTS_SUMMARY,
  SEARCH_PRODUCTS,
  graphqlRequest,
  Product,
  ProductsResponse,
  ProductFilter
} from '@/utils/graphql';

export const useProducts = (
  limit: number = 10,
  offset: number = 0,
  filter?: ProductFilter
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 0,
    offset: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data: ProductsResponse = await graphqlRequest(GET_PRODUCTS, {
        limit,
        offset,
        filter
      });
      console.log("data", data);

      const transformedProducts =await data?.products?.data?.map((item: any) => ({
        id: item.product_uid,
        image: item?.images?.[0]?.product_image || '/placeholder.svg',
        name: item?.product_name,
        description: item?.description,
        sku: item?.product_code,
        category: {name:item?.category?.category_name},
        price: item?.price,
        inventory: item?.track_inventory,
        status: item?.product_status === true ? "Active" : "Draft",
        rating: item?.rating,
        orders: item.orders || 10,
      }));
      console.log("transformedProducts", transformedProducts);
      
      setProducts(transformedProducts);
      setPagination(1)
    //   (data.products.pagination);
    } catch (err) {
        console.log("err", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [limit, offset, filter]);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(GET_PRODUCT_BY_ID, { id });
      setProduct(data.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

export const useProductsSearch = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
      const data = await graphqlRequest(SEARCH_PRODUCTS, {
        query,
        limit,
        offset
      });
      
      setProducts(data.searchProducts.data);
      setPagination(data.searchProducts.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    search
  };
};

export const useProductsSummary = () => {
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(GET_PRODUCTS_SUMMARY);
      setSummary(data.productsSummary);
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