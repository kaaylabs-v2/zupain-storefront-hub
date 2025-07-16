import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the useAuth hook from context for easier imports
export { useAuthContext as useAuth };

// You can add additional auth-related hooks here if needed
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  return {
    isAuthenticated,
    isLoading,
    requireAuth: () => {
      if (!isLoading && !isAuthenticated) {
        // Redirect to login or show auth modal
        window.location.href = '/login';
      }
    }
  };
}; 