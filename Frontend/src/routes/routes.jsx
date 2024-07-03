import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Login from "../pages/Login/Login";
import InitialLayout from "../layouts/InitialLayout";
import Dashboard from "../pages/DashBoard/Dashboard";
import Products from "../pages/Products/Products";
import Brands from "../pages/Brands/Brands";
import Category from "../pages/Category/Category";
import Subcategory from "../pages/Subcategory/Subcategory";
import Stock from "../pages/Stock/Stock";
import Banner from "../pages/Banner/Banner";
import Vendor from "../pages/Vendor/Vendor";
import Customer from "../pages/Customer/Customer";
import User from "../pages/User/User";
import Order from "../pages/Order/Order";
import AllUser from "../pages/User/AllUser";
import Notification from "../pages/Notification/Notification";

const router = createBrowserRouter([
  {
    path: "/", //* Redirects initial render to the login page (if u use protected route then no need to use this route)
    errorElement: <ErrorPage />,
    element: <Navigate to="/login" replace={true} />
  },
  {
    path: "/",
    element: <InitialLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "/product",
        element: <ProtectedRoute element={<Products />} />,
      },
      {
        path: "/category",
        element: <ProtectedRoute element={<Category />} />,
      },
      {
        path: "/subcategory",
        element: <ProtectedRoute element={<Subcategory />} />,
      },
      {
        path: "/brands",
        element: <ProtectedRoute element={<Brands />} />,
      },
      {
        path: "/stock",
        element: <ProtectedRoute element={<Stock />} />,
      },
      {
        path: "/banner",
        element: <ProtectedRoute element={<Banner />} />,
      },
      {
        path: "/notification",
        element: <ProtectedRoute element={<Notification />} />,
      },
      {
        path: "/vendor",
        element: <ProtectedRoute element={<Vendor />} />,
      },
      {
        path: "/customer",
        element: <ProtectedRoute element={<Customer />} />,
      },
      {
        path: "/order",
        element: <ProtectedRoute element={<Order />} />,
      },
      {
        path: "/users/register",
        element: <ProtectedRoute element={<User />} />,
      },
      {
        path: "/users/all-users",
        element: <ProtectedRoute element={<AllUser />} />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
