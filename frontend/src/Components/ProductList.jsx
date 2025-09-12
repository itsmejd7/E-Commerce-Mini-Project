import React, { useState, useEffect } from 'react';
import UpdateProduct from './UpdateProduct';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();  

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteClick = (productId) => {
    fetch(`http://localhost:5000/products/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Product deleted successfully!');
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Product List</h2>
        <Link to="/cart" className="text-blue-700 hover:underline">Go to Cart</Link>
      </div>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <li key={product._id} className="card p-4 flex flex-col">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 160, objectFit: 'cover', border: '1px solid #000', borderRadius: 8 }} />
            ) : (
              <div style={{ width: '100%', height: 160, border: '1px solid #000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="text-sm">No Image</span>
              </div>
            )}
            <div className="min-w-0 flex-1 mt-3">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm">₹{product.price} | Stock: {product.stock}</p>
              {product.description && <p className="text-sm mt-1">{product.description}</p>}
            </div>
            <div className="mt-3">
              <button onClick={() => addToCart(product)} className="btn btn-primary w-full">Add to Cart</button>
            </div>
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <UpdateProduct productId={selectedProduct._id} setProducts={setProducts} />
      )}

      <div className="mt-6 p-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {cart.map((item) => (
                <li key={item.product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-600 font-medium">₹{Number(item.product.price) || 0} each</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      className="w-8 h-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-bold" 
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >-</button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      className="w-8 h-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-bold" 
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >+</button>
                    <button 
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium" 
                      onClick={() => removeFromCart(item.product._id)}
                    >Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-blue-600">₹{cart.reduce((sum, i) => sum + (Number(i.product.price) || 0) * (i.quantity || 0), 0)}</span>
            </div>
            <div className="mt-4 flex gap-3">
              <Link to="/cart" className="flex-1 bg-white text-blue-600 border-2 border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium text-center">View Cart</Link>
              <Link to="/checkout" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center">Checkout</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
