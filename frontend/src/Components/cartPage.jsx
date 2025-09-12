import React from 'react';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalAmount = cart.reduce((total, item) => {
    const priceNumber = Number(item.product.price) || 0;
    return total + priceNumber * (item.quantity || 0);
  }, 0);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.product._id}
              className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm">
                  ₹{item.product.price} | Quantity: {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn" onClick={()=>updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button className="btn" onClick={()=>updateQuantity(item.product._id, item.quantity + 1)}>+</button>
              </div>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="shrink-0 btn btn-danger"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl font-semibold">Total: ₹{totalAmount}</h3>
          <button onClick={() => navigate('/checkout')} className="w-full sm:w-auto btn btn-primary">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
