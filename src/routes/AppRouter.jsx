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

// Import Admin Components
import { BookManagement } from "../components/Admin/BookManagement";
import { OrderManagement } from "../components/Admin/OrderManagement";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Cart from "../pages/Cart";

// Define admin routes with metadata for sidebar navigation
const adminRoutes = [
  {
    path: "/",
    element: <p>Dashboard</p>,
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    path: "/dashboard",
    element: <p>Dashboard</p>,
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    path: "/orders",
    element: <OrderManagement />, // Add OrderManagement component here
    name: "Orders",
    icon: <ShoppingCart size={18} />,
  },
  {
    path: "/books",
    element: <BookManagement />, // Add BookManagement component here
    name: "Books",
    icon: <Book size={18} />,
  },
  {
    path: "/users",
    element: <p>Users Management</p>,
    name: "Users",
    icon: <Users size={18} />,
  },
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
      { path: "/checkout", element: <Checkout /> },
      { path: "/orders", element: <Orders /> },
      { path: "/cart", element: <Cart /> },
      { path: "/me", element: <UserPersonalInfo /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

// Admin router - for authenticated admin users
const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppAdmin />,
    children: adminRoutes
      .map((route) => ({
        path: route.path === "/" ? "" : route.path.replace(/^\//, ""),
        element: route.element,
      }))
      .concat([
        { path: "books/:id", element: <BookDetail /> }, // Book detail route for admin
        { path: "*", element: <Navigate to="/" /> },
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