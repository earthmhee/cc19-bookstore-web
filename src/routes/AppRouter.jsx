// import {
//   createBrowserRouter,
//   Navigate,
//   RouterProvider,
// } from "react-router";
// import App from "../App";
// import Login from "../pages/Login";
// import useUserStore from "../stores/userStore";
// import ProtectedRoute from "./ProtectedRoute";
// import LayoutAdmin from "../layout/LayoutAdmin";
// import Admin from "../components/Admin";
// import AppAdmin from "../AppAdmin";

// const guestRouter = createBrowserRouter([
//   { path: "/", element: <Login /> },
//   { path: "*", element: <Navigate to="/" /> },
// ]);

// const userRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       // <ProtectedRoute>
//         <App />
//       // </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <p>Sidebar + Post</p> },
//       { path: "/books", element: <p>Books Page</p> },
//       { path: "/me", element: <p>Personal user data</p> },
//       { path: "*", element: <Navigate to="/" /> },
//     ],
//   },
// ]);

// const adminRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       // <ProtectedRoute>
//         <AppAdmin />
//       // </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <p>Dashboard</p> },
//       { path: "/dashboard", element: <p>Dashboard</p> },
//       { path: "/manage", element: <p>Manage</p> },
//       { path: "/transaction", element: <p>Transaction</p> },
//       { path: "*", element: <Navigate to="/" /> },
//     ],
//   },
// ]);

// export default function AppRouter() {
//   const user = useUserStore((state) => state.user);
//   const finalRouter = user
//     ? user.role === "ADMIN"
//       ? adminRouter
//       : userRouter
//     : guestRouter;
//   return <RouterProvider key={user?.id} router={finalRouter} />;
// }

// src/routes/AppRouter.jsx
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import useUserStore from "../stores/userStore";
import AppAdmin from "../AppAdmin";
import BookList from "../pages/BookList";
import BookDetail from "../pages/BookDetail"; // Import the BookDetail component
import { Book, LayoutDashboard, ShoppingCart, Users } from "lucide-react";
import UserPersonalInfo from "../pages/UserPersonalInfo";

// Create a BookList component if it doesn't exist
const BookListPage = () => {
  return <BookList />;
};

// Define routes with their metadata for sidebar navigation
const adminRoutes = [
  { 
    path: "/", 
    element: <p>Dashboard</p>,
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />
  },
  { 
    path: "/dashboard", 
    element: <p>Dashboard</p>,
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />
  },
  { 
    path: "/orders", 
    element: <p>Orders Management</p>,
    name: "Orders",
    icon: <ShoppingCart size={18} />
  },
  { 
    path: "/books", 
    element: <p>Books Management</p>,
    name: "Books",
    icon: <Book size={18} />
  },
  { 
    path: "/users", 
    element: <p>Users Management</p>,
    name: "Users",
    icon: <Users size={18} />
  }
];

// Guest router - for unauthenticated users
const guestRouter = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <Navigate to="/" /> },
]);

// User router - for authenticated regular users
const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <BookList /> },
      { path: "/books", element: <BookList /> },
      { path: "/book/:id", element: <BookDetail /> },
      { path: "/me",  element: <UserPersonalInfo/> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

// Admin router - for authenticated admin users
const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppAdmin />,
    children: adminRoutes.map(route => ({
      path: route.path === "/" ? "" : route.path.replace(/^\//, ""),
      element: route.element
    })).concat([
      { path: "books/:id", element: <BookDetail /> }, // Add book detail route for admin
      { path: "*", element: <Navigate to="/" /> }
    ]),
  },
]);

// Export routes for use in Sidebar component
export const getAdminRoutes = () => adminRoutes;

export default function AppRouter() {
  const user = useUserStore((state) => state.user);
  
  // Determine which router to use based on user role
  const finalRouter = user
    ? user.role === "ADMIN"
      ? adminRouter
      : userRouter
    : guestRouter;
    
  return <RouterProvider key={user?.id} router={finalRouter} />;
}