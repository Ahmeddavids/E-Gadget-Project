const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

// Add an item to the cart
const addToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        error: 'Product Id required'
      });
    }

    // Check if the user and Product exist
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user || !product) {
      return res.status(404).json({
        error: 'User or Product not found'
      });
    }

    // Find the user's cart
    let cart = await cartModel.findOne({ user: userId });

    // Create a new cart for the user if no existing cart
    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [],
        grandTotal: 0
      });
    };

    // Check if the Product is already in the cart
    const existingItem = cart.items.find(item => item.product.equals(productId));

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.productTotal = product.price * existingItem.quantity;
    } else {
      const newItem = {
        product: productId,
        quantity: 1,
        productPrice: product.price,
        productName: product.productName,
        productImage: product.images,
        productTotal: product.price,
      };
      cart.items.push(newItem);
    }

    // Recalculate the total price for all items in the cart
    cart.grandTotal = cart.items.reduce((acc, item) => acc + item.productTotal, 0);

    // Save the cart with the updated items and total
    await cart.save();

    return res.status(200).json({
      message: 'Item added to cart successfully',
      cart
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
};




// Remove an item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: 'Product Id required'
      });
    }

    // Check if the user and Product exist
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user || !product) {
      return res.status(404).json({
        error: 'User or Product not found'
      });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }

    // Check if the Product is in the cart
    const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (existingItemIndex === -1) {
      return res.status(404).json({
        error: 'Item not found in the cart'
      });
    }

    // Decrease the quantity of the item by 1
    if (cart.items[existingItemIndex].quantity > 1) {
      cart.items[existingItemIndex].quantity -= 1;
      cart.items[existingItemIndex].productTotal = product.price * cart.items[existingItemIndex].quantity;
    } else {
      // If the quantity becomes less than or equal to 1, remove the item from the cart
      cart.items.splice(existingItemIndex, 1);
    }

    // Recalculate the total price for all items in the cart
    cart.grandTotal = cart.items.reduce((acc, item) => acc + item.productTotal, 0);

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
};


// Delete an item entirely from cart
const deleteItemFroCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: 'Product Id required'
      });
    }

    // Check if the user and Product exist
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user || !product) {
      return res.status(404).json({
        error: 'User or Product not found'
      });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }
    if (cart.items.length === 0) {
      return res.status(404).json({
        message: 'Cart is currently empty'
      });
    }

    // Filter the item ID from the cart items product
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    // Re calcutate the total amount and update the item total
    cart.grandTotal = cart.items.reduce((acc, item) => acc + item.productTotal, 0);

    if (cart.items.length === 0) {
      cart.restaurant = null
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: 'Item deleted from cart successfully',
      cart
    });

  } catch (error) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
};



// Get a user's cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });

    // Create a new cart for the user if no existing cart
    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [],
        grandTotal: 0
      });
    };

    res.status(200).json(cart)

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message
    });
  }
};



module.exports = {
  addToCart,
  removeFromCart,
  deleteItemFroCart,
  getCart
};
