
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-6 shadow-lg z-50">
      <Link 
        to="/" 
        className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1 font-medium">হোম</span>
      </Link>
      
      <Link 
        to="/girlfriends" 
        className={`flex flex-col items-center justify-center ${isActive('/girlfriends') ? 'text-primary' : 'text-gray-500'}`}
      >
        <Users className="w-6 h-6" />
        <span className="text-xs mt-1 font-medium">সাথীরা</span>
      </Link>
      
      <Link 
        to="/chat" 
        className={`flex flex-col items-center justify-center ${isActive('/chat') ? 'text-primary' : 'text-gray-500'}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-xs mt-1 font-medium">চ্যাট</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center justify-center ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}
      >
        <User className="w-6 h-6" />
        <span className="text-xs mt-1 font-medium">প্রোফাইল</span>
      </Link>
    </div>
  );
};

export default Navbar;
