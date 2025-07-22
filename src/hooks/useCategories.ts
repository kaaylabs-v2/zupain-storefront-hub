import { useState, useEffect } from 'react';
import { 
  GET_CATEGORIES, 
  GET_CATEGORY_BY_ID, 
  GET_CATEGORIES_SUMMARY,
  SEARCH_CATEGORIES,
  graphqlRequest,
  Category,
  CategoriesResponse,
  CategoryFilter
} from '@/utils/graphql';

export const useCategories = (
  limit: number = 10,
  offset: number = 0,
  filter?: CategoryFilter
) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 0,
    offset: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Temporarily disable filter to match working queries like products
        const data: CategoriesResponse = await graphqlRequest(GET_CATEGORIES, {
          limit,
          offset,
          filter
        });

        const transformedCategories = data?.categories?.data?.map((item: any) => ({
          id: item.category_uid,
          name: item?.category_name,
          status: item?.is_active === true,
          banner_title: item?.banner_title,
          banner_description: item?.banner_description,
          seo_page_title: item?.seo_page_title,
          seo_meta_description: item?.seo_meta_description,
          seo_url_handle: item?.seo_url_handle,
          products: item?.products_count || 0, // Default since product_count is not available
          image: item?.banner_image || '👤',
          createdAt: item?.creation_date,
          updatedAt: item?.modified_date
        }));
        
        setCategories(transformedCategories);
        console.log("transformedCategories------->", data);

        const paginationData = data.categories.pagination;
        setPagination({
          total: paginationData.total,
          limit: paginationData.limit,
          offset: offset,
          page: paginationData.page,
          totalPages: paginationData.totalPages,
          hasNextPage: paginationData.page < paginationData.totalPages,
          hasPreviousPage: paginationData.page > 1
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit, offset, filter]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Temporarily disable filter to match working queries like products
      const data: CategoriesResponse = await graphqlRequest(GET_CATEGORIES, {
        limit,
        offset,
        filter
      });

      const transformedCategories = data?.categories?.data?.map((item: any) => ({
        id: item.category_uid,
        name: item?.category_name,
        status: item?.is_active === true,
        banner_title: item?.banner_title,
        banner_description: item?.banner_description,
        seo_page_title: item?.seo_page_title,
        seo_meta_description: item?.seo_meta_description,
        seo_url_handle: item?.seo_url_handle,
        products: item?.products_count || 0, // Default since product_count is not available
        image: item?.banner_image || '👤',
        createdAt: item?.creation_date,
        updatedAt: item?.modified_date
      }));
      
      setCategories(transformedCategories);
      const paginationData = data.categories.pagination;
      setPagination({
        total: paginationData.total,
        limit: paginationData.limit,
        offset: offset,
        page: paginationData.page,
        totalPages: paginationData.totalPages,
        hasNextPage: paginationData.page < paginationData.totalPages,
        hasPreviousPage: paginationData.page > 1
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    pagination,
    refetch
  };
};

export const useCategory = (id: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(GET_CATEGORY_BY_ID, { id });
      setCategory(data.category);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory
  };
};

export const useCategoriesSearch = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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
      const data = await graphqlRequest(SEARCH_CATEGORIES, {
        query,
        limit,
        offset
      });
      
      setCategories(data.searchCategories.data);
      setPagination(data.searchCategories.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    pagination,
    search
  };
};

export const useCategoriesSummary = () => {
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalProducts: 0,
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(GET_CATEGORIES_SUMMARY);
      setSummary(data.categoriesSummary.data);
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