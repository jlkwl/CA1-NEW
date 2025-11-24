// ...existing code...
const Product = require('../models/Product');

const ProductController = {
  // List all products. Supports optional query params: search, limit, offset, orderBy, order
  list: function (req, res) {
    const params = {
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset,
      orderBy: req.query.orderBy,
      order: req.query.order
    };

    Product.getAll(params, function (err, results) {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.json(results);
    });
  },

  // Get a single product by ID
  getById: function (req, res) {
    const productId = req.params.productId || req.params.id;
    if (!productId) return res.status(400).json({ error: 'Missing productId parameter' });

    Product.getById(productId, function (err, product) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json(product);
    });
  },

  // Add a new product
  create: function (req, res) {
    const product = {
      productName: req.body.productName,
      productImage: req.file ? req.file.filename : (req.body.productImage || null),
      quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity, 10) : 0,
      price: req.body.price !== undefined ? parseFloat(req.body.price) : 0
    };

    if (!product.productName) return res.status(400).json({ error: 'productName is required' });

    Product.add(product, function (err, result) {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(201).json({ productId: result.insertId });
    });
  },

  // Update an existing product
  update: function (req, res) {
    const productId = req.params.productId || req.params.id;
    if (!productId) return res.status(400).json({ error: 'Missing productId parameter' });

    const product = {
      productName: req.body.productName,
      productImage: req.file ? req.file.filename : (req.body.productImage || null),
      quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity, 10) : 0,
      price: req.body.price !== undefined ? parseFloat(req.body.price) : 0
    };

    Product.update(productId, product, function (err, result) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
      return res.json({ affectedRows: result.affectedRows });
    });
  },

  // Delete a product by ID
  delete: function (req, res) {
    const productId = req.params.productId || req.params.id;
    if (!productId) return res.status(400).json({ error: 'Missing productId parameter' });

    Product.delete(productId, function (err, result) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
      return res.json({ affectedRows: result.affectedRows });
    });
  }
};

module.exports = ProductController;
// ...existing code...