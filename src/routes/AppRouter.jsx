import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import App from "../App";
import Login from "../pages/Login";

const guestRouter = createBrowserRouter([
  { path: "/", element: <Login/> },
  { path: "*", element: <Navigate to="/" /> },
]);
const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <p>Sidebar + Post</p> },
      { path: "/books", element: <p>Books Page</p> },
      { path: "/friends", element: <p>Friend Page</p> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

export default function AppRouter() {
  const user = null;
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}
