import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AddProduct from './AddProduct';
import ProductManagement from './ProductManagement';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Seller Dashboard</h2>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'add'
              ? 'bg-white text-blue-500 border-2 border-blue-500'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'manage'
              ? 'bg-white text-blue-500 border-2 border-blue-500'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          Manage Products
        </button>
      </div>

      
      <div className="card p-6">
        {activeTab === 'add' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Add a New Product</h3>
            <AddProduct setProducts={setProducts} />
          </div>
        )}
        
        {activeTab === 'manage' && (
          <div>
            <h3 className="text-cyan-50 text-xl font-semibold mb-4">Manage Your Products</h3>
            <ProductManagement products={products} setProducts={setProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;


