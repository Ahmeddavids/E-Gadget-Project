const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    productTotal: {
      type: Number,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: [{
      type: String,
      required: true
    }]
  }],
  grandTotal: {
    type: Number,
    default: 0
  }
});

const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel
