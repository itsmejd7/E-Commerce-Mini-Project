import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ProductList from './Components/ProductList';
import CartPage from './Components/cartPage';
import { CartProvider } from './Components/CartContext';
import { useCart } from './Components/CartContext';
import { AuthProvider, useAuth } from './Components/AuthContext';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';
import SellerDashboard from './Components/SellerDashboard';

function App() {
  const [products, setProducts] = useState([]);

  const Header = () => {
    const { cart } = useCart();
    const { token, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const isSeller = !!user && user.role === 'seller';
    const doLogout = () => { logout(); navigate('/login', { replace: true }); };
    return (
      <div className="navbar mb-6 border-b border-black pb-4">
        <h1 className="text-3xl font-bold" style={{ color: '#1d4ed8' }}>E-Store</h1>
        {!isAuthPage && (
          <div className="links">
            {!isSeller && (
              <>
                <Link to="/" className="btn">Home</Link>
                <Link to="/cart" className="btn btn-primary">Cart ({itemCount})</Link>
                <Link to="/checkout" className="btn">Checkout</Link>
              </>
            )}
            {isSeller && (<Link to="/sell" className="btn">Sell</Link>)}
            {!token && (
              <>
                <Link to="/login" className="btn">Login</Link>
                <Link to="/signup" className="btn">Signup</Link>
              </>
            )}
            {token && (<button onClick={doLogout} className="btn bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400">Logout{user?.name ? ` (${user.name})` : ''}</button>)}
          </div>
        )}
      </div>
    );
  };

  const GuestOnly = ({ children }) => {
    const { token } = useAuth();
    if (token) return <Navigate to="/" replace />;
    return children;
  };

  const ProtectedUser = ({ children }) => {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (user && user.role === 'seller') return <Navigate to="/sell" replace />;
    return children;
  };

  const ProtectedSeller = ({ children }) => {
    const { user, token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (!user || user.role !== 'seller') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white page">
            <div className="container">
              <div className="content-box">
                <Header />
                <Routes>
                  <Route path="/" element={<ProtectedUser><ProductList products={products} setProducts={setProducts} /></ProtectedUser>} />
                  <Route path="/cart" element={<ProtectedUser><CartPage /></ProtectedUser>} />
                  <Route path="/checkout" element={<ProtectedUser><Checkout /></ProtectedUser>} />
                  <Route path="/order-confirmation" element={<ProtectedUser><OrderConfirmation /></ProtectedUser>} />
                  <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
                  <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
                  <Route path="/sell" element={<ProtectedSeller><SellerDashboard /></ProtectedSeller>} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
