// import React from "react";
// import { Bell } from "lucide-react"; // For the notification icon
// import useUserStore from "../stores/userStore";
// import { sidebarLinkAdmin } from "../utils/links";
// import { Link } from "react-router";

// const NavbarAdmin = () => {
//     const user = useUserStore((state) => state.user);
//   return (
//     <nav className="bg-black text-white py-4 px-8 flex items-center justify-between shadow-md">
//       {/* Left Section - Logo */}
//       <div className="flex items-center gap-2">
//         <img src="/logo.png" alt="Logo" className="h-10 w-10" />
//         <div>
//           <h1 className="text-lg font-bold text-yellow-400">8 Lines?</h1>
//           <p className="text-xs italic opacity-75">A Shop for Great Books</p>
//         </div>
//       </div>

//       {/* Center Section - Navigation Links */}
//       <ul className="flex gap-6 text-lg">
//       {sidebarLinkAdmin.map((item) => (
//     <li key={item.link} className="hover:text-yellow-400 cursor-pointer transition">
//       <Link to={item.link} className="flex items-center gap-2">
//         {item.icon}
//         {item.label}
//       </Link>
//     </li>
//   ))}
//       </ul>

//       {/* Right Section - Notification & User Profile */}
//       <div className="flex items-center gap-4">
//         {/* Notification Bell Icon */}
//         <Bell className="h-6 w-6 cursor-pointer hover:text-yellow-400" />

//         {/* User Profile */}
//         <div className="flex items-center gap-2">
//           <img
//             src="/user-avatar.png"
//             alt="User Avatar"
//             className="h-8 w-8 rounded-full border-2 border-yellow-400"
//           />
//           <p className="text-sm opacity-75">{user.firstName}</p>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavbarAdmin;

// src/components/NavbarAdmin.jsx
// src/components/NavbarAdmin.jsx
// src/components/NavbarAdmin.jsx
import React from 'react';
import { useNavigate } from 'react-router';
import { Book, Bell, User, LogOut } from 'lucide-react';
import useUserStore from '../stores/userStore';
import { toast } from 'react-toastify';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
  };
  
  return (
    <nav className="bg-dark-darker border-b border-border py-3 px-4">
      <div className="flex justify-between items-center">
        <div 
          className="flex items-center text-gold cursor-pointer"
          onClick={() => navigate('/admin')}
        >
          <Book className="mr-2" size={24} />
          <span className="font-bold tracking-wider">NORTH BOOKPOINT</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Bell size={20} className="text-white hover:text-gold cursor-pointer transition-colors" />
            <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-white hover:text-gold cursor-pointer transition-colors">
            <User size={20} />
            <span className="hidden md:inline">{user?.firstName || 'Admin'}</span>
          </div>
          
          <div 
            className="flex items-center space-x-2 text-white hover:text-gold cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;