import { useState } from 'react';
import { 
  CREATE_CATEGORY, 
  UPDATE_CATEGORY, 
  DELETE_CATEGORY,
  graphqlRequest,
  CreateCategoryInput,
  UpdateCategoryInput,
  Category
} from '@/utils/graphql';

export const useCategoryMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (input: CreateCategoryInput): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(CREATE_CATEGORY, { input });
      
      // Transform the response to match your Category interface
      const category: Category = {
        id: data.createCategory.category_uid,
        name: data.createCategory.category_name,
        status: data.createCategory.is_active,
        products: 0, // New category has no products initially
        image: data.createCategory.banner_image || '📁',
        description: data.createCategory.banner_description,
        createdAt: data.createCategory.creation_date,
        updatedAt: data.createCategory.modified_date
      };
      
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, input: UpdateCategoryInput): Promise<Category | null> => {
    setLoading(true);
    setError(null);

    console.log("updateInput", input);
    console.log("updateId", id);
    try {
      const data = await graphqlRequest(UPDATE_CATEGORY, { id, input });
      
      // Transform the response to match your Category interface
      const category: Category = {
        id: data.updateCategory.category_uid,
        name: data.updateCategory.category_name,
        status: data.updateCategory.is_active,
        products: 0, // You might want to preserve the existing count
        image: data.updateCategory.banner_image || '📁',
        description: data.updateCategory.banner_description,
        createdAt: data.updateCategory.creation_date,
        updatedAt: data.updateCategory.modified_date
      };
      
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await graphqlRequest(DELETE_CATEGORY, { id });
      return data.deleteCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error
  };
}; 