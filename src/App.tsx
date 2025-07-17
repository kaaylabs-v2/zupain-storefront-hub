
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ShiprocketOrders from "./pages/ShiprocketOrders";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Stores from "./pages/Stores";
import Customers from "./pages/Customers";
import Categories from "./pages/Categories";
import Plans from "./pages/Plans";
import ChangePlan from "./pages/ChangePlan";
import Coupons from "./pages/Coupons";
import WhatsApp from "./pages/WhatsApp";
import PageBuilder from "./pages/PageBuilder";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes - Only accessible when NOT authenticated */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes - Only accessible when authenticated */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shiprocket-orders" 
                element={
                  <ProtectedRoute>
                    <ShiprocketOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stores" 
                element={
                  <ProtectedRoute>
                    <Stores />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers" 
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/categories" 
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/plans" 
                element={
                  <ProtectedRoute>
                    <Plans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/change-plan" 
                element={
                  <ProtectedRoute>
                    <ChangePlan />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/coupons" 
                element={
                  <ProtectedRoute>
                    <Coupons />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/whatsapp" 
                element={
                  <ProtectedRoute>
                    <WhatsApp />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/page-builder/*" 
                element={
                  <ProtectedRoute>
                    <PageBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
