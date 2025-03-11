
// src/components/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import useUserStore from '../stores/userStore';
import { toast } from 'react-toastify';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center text-white hover:text-gold transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User size={20} />
        <span className="ml-2 hidden md:inline">{user?.firstName || 'Account'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-lighter border border-border rounded-md shadow-lg z-10">
          <div className="py-2 px-4 border-b border-border">
            <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors text-left"
              onClick={() => {
                navigate('/account');
                setIsOpen(false);
              }}
            >
              <User size={16} className="mr-2" />
              <span>My Account</span>
            </button>
            
            <button
              className="flex items-center w-full px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors text-left"
              onClick={() => {
                navigate('/orders');
                setIsOpen(false);
              }}
            >
              <ShoppingBag size={16} className="mr-2" />
              <span>My Orders</span>
            </button>
            
            <button
              className="flex items-center w-full px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors text-left"
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
            >
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </button>
          </div>
          
          <div className="py-1 border-t border-border">
            <button
              className="flex items-center w-full px-4 py-2 text-white hover:bg-dark-darker hover:text-gold transition-colors text-left"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;