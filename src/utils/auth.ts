/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls and token management.
 * Provides a clean interface for login, logout, and user state management.
 */

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email_address: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Configuration - Fixed for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
const API_VERSION = 'v1';
const BASE_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Storage Keys
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// API Endpoints
const AUTH_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/auth/me',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
};

// Token Management
export const tokenService = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

// User Management
export const userService = {
  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Auth API Request Error:', error);
    throw error;
  }
};

// Authentication API Functions
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(AUTH_ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens and user data
    tokenService.setToken(response.data.accessToken);
    if (response.data.refreshToken) {
      tokenService.setRefreshToken(response.data.refreshToken);
    }
    userService.setUser(response.data.user);

    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    const token = tokenService.getToken();
    
    if (token) {
      try {
        await apiRequest(AUTH_ENDPOINTS.logout, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }

    // Clear local storage regardless of API success
    tokenService.removeToken();
    tokenService.removeRefreshToken();
    userService.removeUser();
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const token = tokenService.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await apiRequest<User>(AUTH_ENDPOINTS.me, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Update stored user data
    userService.setUser(response);
    return response;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiRequest<AuthResponse>(AUTH_ENDPOINTS.refresh, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update stored tokens
    tokenService.setToken(response.data.accessToken);
    if (response.data.refreshToken) {
      tokenService.setRefreshToken(response.data.refreshToken);
    }
    if (response.data.user) {
      userService.setUser(response.data.user);
    }

    return response;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(AUTH_ENDPOINTS.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(AUTH_ENDPOINTS.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Auth state management
export const authService = {
  // Initialize auth state from localStorage
  initializeAuth: (): AuthState => {
    const token = tokenService.getToken();
    const user = userService.getUser();

    if (token && user && !tokenService.isTokenExpired(token)) {
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      };
    }

    // Clear invalid data
    if (token) tokenService.removeToken();
    if (user) userService.removeUser();

    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenService.getToken();
    return !!(token && !tokenService.isTokenExpired(token));
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return userService.getUser();
  },

  // Get auth headers for API requests
  getAuthHeaders: (): HeadersInit => {
    const token = tokenService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  },
};

export default authService; 