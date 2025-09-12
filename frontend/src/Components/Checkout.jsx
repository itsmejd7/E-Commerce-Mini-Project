import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const Checkout = () => {
  const { cart, removeFromCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.product.price) || 0) * (item.quantity || 0), 0);

  const placeOrder = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const products = cart.map((i) => ({ product: i.product._id, quantity: i.quantity }));
      const res = await fetch('http://localhost:5000/api/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ products, shipping })
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || 'Failed to place order');
      }
      // Clear cart items locally
      cart.forEach((i) => removeFromCart(i.product._id));
      navigate('/order-confirmation');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      {!user && <p className="mb-4 text-sm">Please login to complete your purchase.</p>}
      {error && <p className="mb-2" style={{ color: '#b91c1c' }}>{error}</p>}

      <div className="card p-4 mb-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {cart.map((item)=> (
              <li key={item.product._id} className="flex justify-between">
                <span>{item.product.name} x {item.quantity}</span>
                <span>₹{(Number(item.product.price) || 0) * (item.quantity || 0)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Shipping Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Full Name" value={shipping.name} onChange={(e)=>setShipping({...shipping, name: e.target.value})} required />
          <input className="input sm:col-span-2" placeholder="Address" value={shipping.address} onChange={(e)=>setShipping({...shipping, address: e.target.value})} required />
          <input className="input" placeholder="City" value={shipping.city} onChange={(e)=>setShipping({...shipping, city: e.target.value})} required />
          <input className="input" placeholder="Phone" value={shipping.phone} onChange={(e)=>setShipping({...shipping, phone: e.target.value})} required />
        </div>
        <button disabled={loading || cart.length===0} onClick={placeOrder} className="mt-4 w-full btn btn-primary">
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;


