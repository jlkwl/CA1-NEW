// ...existing code...
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const CartController = {
  // 1. addToCart
  addToCart: function (req, res) {
    const productId = parseInt(req.params.id || req.params.productId, 10);
    const quantity = parseInt(req.body.quantity, 10) || 1;
    if (!productId) {
      req.flash('error', 'Invalid product');
      return res.redirect('back');
    }

    Product.getById(productId, (err, product) => {
      if (err) {
        req.flash('error', 'Database error');
        return res.redirect('back');
      }
      if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('back');
      }

      // Use Cart helper to add item to session cart
      if (typeof Cart.addItem === 'function') {
        Cart.addItem(req, product, quantity);
      } else {
        // fallback: simple session-based add
        req.session.cart = req.session.cart || [];
        const existing = req.session.cart.find(i => i.productId === product.productId);
        if (existing) existing.quantity += quantity;
        else req.session.cart.push({
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          quantity,
          image: product.productImage
        });
      }

      req.flash('success', `${product.productName} added to cart`);
      // redirect back to the page user came from or to shopping
      const referer = req.get('Referer') || '/shopping';
      res.redirect(referer);
    });
  },

  // 2. showCart
  showCart: function (req, res) {
    const cart = (typeof Cart.getCart === 'function') ? Cart.getCart(req) : (req.session.cart || []);
    const total = (typeof Cart.getTotal === 'function') ? Cart.getTotal(req) : (cart.reduce((s, it) => s + (it.price * it.quantity), 0));
    res.render('cart', { cart, total, user: req.session.user, messages: { success: req.flash('success'), error: req.flash('error') } });
  },

  // 3. updateCartItem
  updateCartItem: function (req, res) {
    const productId = parseInt(req.params.id || req.body.productId, 10);
    const quantity = parseInt(req.body.quantity, 10);
    if (isNaN(productId) || isNaN(quantity)) return res.redirect('/cart');

    req.session.cart = req.session.cart || [];
    const index = req.session.cart.findIndex(i => i.productId === productId);
    if (index === -1) return res.redirect('/cart');

    if (quantity <= 0) {
      // remove item
      req.session.cart.splice(index, 1);
    } else {
      req.session.cart[index].quantity = quantity;
    }

    res.redirect('/cart');
  },

  // 4. removeItem
  removeItem: function (req, res) {
    const productId = parseInt(req.params.id || req.params.productId, 10);
    if (isNaN(productId)) {
      req.flash('error', 'Invalid product');
      return res.redirect('/cart');
    }
    req.session.cart = req.session.cart || [];
    const before = req.session.cart.length;
    req.session.cart = req.session.cart.filter(i => i.productId !== productId);
    const after = req.session.cart.length;

    if (after < before) req.flash('success', 'Item removed from cart');
    else req.flash('error', 'Item not found in cart');

    res.redirect('/cart');
  },

  // 5. clearCart
  clearCart: function (req, res) {
    if (typeof Cart.clearCart === 'function') {
      Cart.clearCart(req);
    } else {
      req.session.cart = [];
    }
    req.flash('success', 'Cart cleared');
    res.redirect('/cart');
  },

  // 6. checkout
  checkout: function (req, res) {
    const cart = (typeof Cart.getCart === 'function') ? Cart.getCart(req) : (req.session.cart || []);
    if (!cart || cart.length === 0) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }

    // Simulate checkout process (e.g., create order, charge payment...) - simplified
    // In real app: persist order to DB, process payment, send confirmation, etc.
    // After successful checkout clear cart
    if (typeof Cart.clearCart === 'function') {
      Cart.clearCart(req);
    } else {
      req.session.cart = [];
    }

    req.flash('success', 'Checkout complete. Thank you for your purchase!');
    res.redirect('/shopping');
  }
};

module.exports = CartController;
// ...existing code...