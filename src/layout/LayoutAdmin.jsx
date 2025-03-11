// import React from 'react'
// import { Link } from 'react-router'

// function LayoutAdmin() {
//   return (
//     <>
//     <div>LayoutAdmin</div>
//     <div className='flex flex-col gap-4'>
//     <Link to="/" >Home</Link>
//     <Link to="/management" >management</Link>
//     </div>
//     </>
//   )
// }

// export default LayoutAdmin
import React from 'react';
import { Outlet } from 'react-router';
import NavbarAdmin from '../components/NavbarAdmin';
import Sidebar from '../components/Sidebar';

const LayoutAdmin = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <NavbarAdmin />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      <footer className="bg-dark-darker text-gray-500 text-center py-4 border-t border-border">
        <p>© {new Date().getFullYear()} 8 Lines? . All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LayoutAdmin;