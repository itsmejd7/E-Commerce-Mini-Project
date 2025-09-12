const express = require('express');
const authenticate = require('../middleware/authenticate');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();


router.post('/place', authenticate, async (req, res) => {
  const { products } = req.body;
  let totalAmount = 0;

  for (let item of products) {
    const product = await Product.findById(item.product);
    if (product) {
      totalAmount += product.price * item.quantity;
    } else {
      return res.status(404).json({ message: `Product not found: ${item.product}` });
    }
  }

  const newOrder = new Order({
    user: req.user,
    products,
    totalAmount,
  });

  await newOrder.save();
  res.status(201).json(newOrder);
});


router.get('/orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});



module.exports = router;
