import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import UpdateProduct from './UpdateProduct';

const ProductManagement = ({ products, setProducts }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const { token } = useAuth();

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token || '',
            'x-user-role': 'seller'
          }
        });

        if (response.ok) {
          alert('Product deleted successfully!');
          // Update the products list
          const updatedProducts = products.filter(product => product._id !== productId);
          setProducts(updatedProducts);
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateComplete = () => {
    setEditingProduct(null);
    // Refresh the products list
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  if (editingProduct) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Product</h4>
          <button
            onClick={() => setEditingProduct(null)}
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
        <UpdateProduct 
          productId={editingProduct._id} 
          setProducts={setProducts}
          onUpdateComplete={handleUpdateComplete}
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No products found. Add your first product!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                    <p className="text-gray-600 text-sm">{product.category}</p>
                    <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-medium">Price: ₹{product.price}</span>
                  <span className="font-medium">Stock: {product.stock}</span>
                  <span className="text-xs text-gray-400">
                    ID: {product._id}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
