// import React from 'react'
// import { sidebarLinkAdmin } from '../utils/links'
// import { Link } from 'react-router'

// function Sidebar() {
//   return (
//     sidebarLinkAdmin.map((item) => (
//       <div key={item.label} className="flex items-center gap-2" >
        
//         <Link to={item.link}>{item.icon}</Link>
//         <p>{item.label}</p>
//       </div>
//     ))
//   )
// }

// export default Sidebar

import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, ShoppingCart, BookOpen, 
  Users, BarChart2, Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
    { path: '/admin/books', icon: <BookOpen size={18} />, label: 'Books' },
    { path: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { path: '/admin/statistics', icon: <BarChart2 size={18} />, label: 'Statistics' },
    { path: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];
  
  return (
    <div className="bg-dark-darker border-r border-border h-full w-64">
      <div className="py-4">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center py-3 px-4 text-white transition-colors cursor-pointer ${
              isActive(item.path)
                ? 'bg-opacity-10 bg-gold text-gold border-l-2 border-gold'
                : 'hover:bg-opacity-10 hover:bg-gold hover:text-gold'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;