import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UpdateProduct = ({ productId, setProducts, onUpdateComplete }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const { token } = useAuth();

  // Fetch the product data for the selected product
  useEffect(() => {
    fetch(`http://localhost:5000/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setPrice(data.price);
        setStock(data.stock);
        setCategory(data.category);
        setImageUrl(data.imageUrl || '');
        setDescription(data.description || '');
      })
      .catch((error) => console.error('Error fetching product data:', error));
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = { name, price, stock, category, imageUrl, description };

    // PUT request to update the product
    fetch(`http://localhost:5000/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
        'x-user-role': 'seller'
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Product updated successfully!');
        if (onUpdateComplete) {
          onUpdateComplete();
        } else {
          // Fallback to old behavior
          fetch('http://localhost:5000/products')
            .then((response) => response.json())
            .then((data) => setProducts(data));
        }
      })
      .catch((error) => {
        console.error('Error updating product:', error);
        alert('Error updating product. Please try again.');
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Price (in INR)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
