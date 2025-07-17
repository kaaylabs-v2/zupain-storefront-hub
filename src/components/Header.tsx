
import React from 'react';
import { Menu, Bell, Search, User, Globe, Wallet, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSettings from './ThemeSettings';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="relative hidden sm:block flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
          <Button variant="outline" size="sm" className="hidden xl:flex space-x-2 text-xs">
            <Globe className="w-4 h-4" />
            <span>Translate</span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden md:flex space-x-2 text-xs">
            <Wallet className="w-4 h-4" />
            <span className="hidden lg:inline">Wallet</span>
            <span>₹0.00</span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden lg:flex space-x-2 text-xs">
            <span>Store</span>
          </Button>

          <ThemeSettings />

          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => navigate('/profile')}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <Button variant="outline" size="sm" onClick={handleLogout} className="hidden xl:flex space-x-2 text-xs">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="mt-3 sm:hidden">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
