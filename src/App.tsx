import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Catalog from './pages/Catalog';
import HelpMeChoose from './pages/HelpMeChoose';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminSettings from './pages/AdminSettings';
import Cart from './pages/Cart';
import CustomerOrders from './pages/CustomerOrders';

// Components
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink-dark"></div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Customer Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/help-me-choose" element={<HelpMeChoose />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<CustomerOrders />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={user ? <AdminLayout /> : <Navigate to="/admin/login" />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}