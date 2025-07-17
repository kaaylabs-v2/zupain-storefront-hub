
import React from 'react';
import { Users } from 'lucide-react';

const CustomersHeader = () => {
  return (
    <div className="space-y-4">
      {/* Enhanced Page Title with Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Management</h1>
            <p className="text-sm text-gray-600">Build stronger relationships with your customers</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span>Live data</span>
          </div>
          <span>•</span>
          <span>Last updated: 2 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
