// ...existing code...
const db = require('../db');

const Product = {
  /**
   * Get all products.
   * params: { search, limit, offset, orderBy, order } (all optional)
   * callback: function(err, results)
   */
  getAll: function (params, callback) {
    params = params || {};
    let sql = 'SELECT productId, productName, productImage, quantity, price FROM products';
    const values = [];

    if (params.search) {
      sql += ' WHERE productName LIKE ?';
      values.push(`%${params.search}%`);
    }

    const orderBy = params.orderBy || 'productId';
    const order = (params.order && params.order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${db.escapeId ? db.escapeId(orderBy) : orderBy} ${order}`;

    if (params.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(params.limit, 10) || 0);
      if (params.offset) {
        sql += ' OFFSET ?';
        values.push(parseInt(params.offset, 10) || 0);
      }
    }

    db.query(sql, values, callback);
  },

  /**
   * Get a product by ID.
   * params: productId
   * callback: function(err, result)
   */
  getById: function (productId, callback) {
    const sql = 'SELECT productId, productName, productImage, quantity, price FROM products WHERE productId = ?';
    db.query(sql, [productId], function (err, results) {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  },

  /**
   * Add a new product.
   * params: { productName, productImage, quantity, price }
   * callback: function(err, result)
   */
  add: function (product, callback) {
    const sql = 'INSERT INTO products (productName, productImage, quantity, price) VALUES (?, ?, ?, ?)';
    const values = [
      product.productName,
      product.productImage || null,
      product.quantity || 0,
      product.price || 0
    ];
    db.query(sql, values, callback);
  },

  /**
   * Update an existing product.
   * params: productId, product: { productName, productImage, quantity, price }
   * callback: function(err, result)
   */
  update: function (productId, product, callback) {
    const sql = 'UPDATE products SET productName = ?, productImage = ?, quantity = ?, price = ? WHERE productId = ?';
    const values = [
      product.productName,
      product.productImage || null,
      product.quantity || 0,
      product.price || 0,
      productId
    ];
    db.query(sql, values, callback);
  },

  /**
   * Delete a product by ID.
   * params: productId
   * callback: function(err, result)
   */
  delete: function (productId, callback) {
    const sql = 'DELETE FROM products WHERE productId = ?';
    db.query(sql, [productId], callback);
  }
};

module.exports = Product;
// ...existing code...