// import React from "react";
// import { Outlet } from "react-router";
// import useUserStore from "./stores/userStore";
// import NavbarAdmin from "./components/NavbarAdmin";

// function AppAdmin() {
//   const user = useUserStore((state) => state.user);
//   const logout = useUserStore((state) => state.logout);
//   return (
//     <>
//       <NavbarAdmin />
//       <p>Header</p>
//       <p>Welcome, {user.firstName}</p>
//       <div className="btn btn-accent" onClick={logout}>
//         Logout
//       </div>
//       <Outlet />
//     </>
//   );
// }

// export default AppAdmin;    

import React from 'react';
import { Outlet } from 'react-router';
import LayoutAdmin from './layout/LayoutAdmin';

function AppAdmin() {
  return <LayoutAdmin />;
}

export default AppAdmin;