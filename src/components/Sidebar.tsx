
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Store, 
  Users, 
  Tag, 
  CreditCard, 
  BarChart3, 
  Settings,
  MessageSquare,
  PenTool,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobileMenuOpen, onMobileMenuClose }) => {
  const { currentPalette } = useTheme();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['page-builder']);
  
  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuKey) 
        ? prev.filter(key => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', isActive: true },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Store, label: 'Stores', path: '/stores' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Tag, label: 'Categories', path: '/categories' },
    { icon: CreditCard, label: 'Plans & Wallet', path: '/plans' },
    { icon: Users, label: 'Coupons', path: '/coupons' },
    { icon: MessageSquare, label: 'WhatsApp Tool', path: '/whatsapp' },
    { 
      icon: PenTool, 
      label: 'Page Builder', 
      path: '/page-builder',
      hasSubmenu: true,
      key: 'page-builder',
      submenu: [
        { label: 'Landing Page', path: '/page-builder/landing-page' },
        { label: 'Additional Pages', path: '/page-builder/additional-pages' },
        { label: 'Menu Builder', path: '/page-builder/menu' },
        { label: 'Appearance', path: '/page-builder/appearance' },
        { label: 'Theme Builder', path: '/page-builder/theme-builder' }
      ]
    },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Whatsapp Business', path: '/whatsapp-business' },
  ];

  const isMenuExpanded = (menuKey: string) => expandedMenus.includes(menuKey);
  const isPathActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Responsive icon sizes
  const iconSize = isCollapsed ? 'w-5 h-5' : 'w-4 h-4';
  const logoIconSize = 'w-6 h-6';

  const handleNavClick = () => {
    if (onMobileMenuClose && window.innerWidth < 1024) {
      onMobileMenuClose();
    }
  };

  // Rail Navigation Style - Clean and minimal
  if (isCollapsed && window.innerWidth >= 1024) {
    return (
      <div className="w-16 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Navigation Rail */}
        <nav className="flex-1 py-4">
          <div className="space-y-1">
            {menuItems.filter(item => !item.hasSubmenu).map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `relative group flex items-center justify-center h-12 mx-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                
                {/* Hover label */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-slate-700">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
                </div>
              </NavLink>
            ))}

            {/* Page Builder with expandable submenu */}
            {menuItems.filter(item => item.hasSubmenu).map((item, index) => (
              <div key={index} className="relative group">
                <div
                  className={`flex items-center justify-center h-12 mx-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isPathActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </div>

                {/* Expandable submenu panel */}
                <div className="absolute left-full top-0 ml-3 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3">
                    <div className="text-sm font-medium text-white mb-3">{item.label}</div>
                    <div className="space-y-1">
                      {item.submenu?.map((subItem: any, subIndex: number) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                  {/* Arrow pointer */}
                  <div className="absolute left-0 top-6 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer indicator */}
        <div className="h-16 flex items-center justify-center border-t border-slate-800">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Regular expanded sidebar
  return (
    <div className={`${currentPalette.sidebar} ${currentPalette.sidebarText} transition-all duration-300 w-64 min-h-screen flex flex-col relative`}>
      
      {/* Mobile close button */}
      <button
        onClick={onMobileMenuClose}
        className="lg:hidden absolute top-4 right-4 z-10 p-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Logo Section */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate">Vitanix consumer</h2>
            <p className="text-xs text-slate-400 truncate">private limited</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.hasSubmenu ? (
                <div>
                  <div
                    className={`flex items-center justify-between px-2 sm:px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isPathActive(item.path)
                        ? `${currentPalette.primary} text-white`
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    onClick={() => toggleMenu(item.key!)}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <item.icon className={iconSize} />
                      <span className="text-xs sm:text-sm truncate">{item.label}</span>
                    </div>
                    {isMenuExpanded(item.key!) ? 
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> : 
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    }
                  </div>
                  
                  {isMenuExpanded(item.key!) && item.submenu && (
                    <ul className="ml-6 sm:ml-8 mt-1 sm:mt-2 space-y-1">
                      {item.submenu.map((subItem: any, subIndex: number) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `block px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-colors truncate ${
                                isActive
                                  ? `${currentPalette.accent} text-white`
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg transition-colors min-w-0 ${
                      isActive
                        ? `${currentPalette.primary} text-white`
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className={iconSize} />
                  <span className="text-xs sm:text-sm truncate">{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 sm:p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          Powered by
          <br />
          <span className="text-white font-semibold">Zupain</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
