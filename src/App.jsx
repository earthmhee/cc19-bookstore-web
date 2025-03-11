// import { Outlet } from "react-router";
// import useUserStore from "./stores/userStore";
// import Navbar from "./components/Navbar";

// function App() {
//   const user = useUserStore((state) => state.user);
//   const logout = useUserStore((state) => state.logout);
//   return (
//     <>
//       <Navbar />
//       <p>Header</p>
//       <p>Welcome, {user.firstName}</p>
//       <div className="btn btn-accent" onClick={logout} >Logout</div>
//       <Outlet />
//     </>
//   );
// }

// export default App;

import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-black text-center py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-gold font-bold mb-2">8 Lines?</div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} 8 Lines? .  All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;