import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const AddProduct = ({ setProducts }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const { token } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = { name, price, stock, category, imageUrl, description };

    fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
        'x-user-role': 'seller'
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Product added successfully!');
        setName('');
        setPrice('');
        setStock('');
        setCategory('');
        setImageUrl('');
        setDescription('');
        
        
        fetchProducts();
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);  
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
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
