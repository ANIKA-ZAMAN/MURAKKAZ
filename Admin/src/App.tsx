import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { AdminLayout } from './components/layout/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';
import BlogList from './pages/blog/BlogList';
import BlogForm from './pages/blog/BlogForm';
import EventList from './pages/events/EventList';
import EventForm from './pages/events/EventForm';
import Reviews from './pages/Reviews';
import Stores from './pages/Stores';
import Users from './pages/Users';
import Content from './pages/Content';
import Settings from './pages/Settings';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#111112',
          color: '#C5A880',
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.2rem',
        }}
      >
        Loading Murakkaz Admin...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="collections" element={<ProductList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/new" element={<BlogForm />} />
                <Route path="blog/:id/edit" element={<BlogForm />} />
                <Route path="events" element={<EventList />} />
                <Route path="events/new" element={<EventForm />} />
                <Route path="events/:id/edit" element={<EventForm />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="stores" element={<Stores />} />
                <Route path="users" element={<Users />} />
                <Route path="cms" element={<Content />} />
                <Route path="content" element={<Content />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
