const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

//timestamps is used us to show the the date along with time when the for ex the product is created

const Product = mongoose.model('Product', productSchema);

module.exports = Product;