const db = require('../db');

const User = {
  /**
   * Create a new user.
   * user: { username, email, password, address, contact, role }
   * callback: function(err, result)
   * Password stored as SHA1(password)
   */
  create: function (user, callback) {
    const sql = 'INSERT INTO users (username, email, password, address, contact, role) VALUES (?, ?, SHA1(?), ?, ?, ?)';
    const values = [
      user.username,
      user.email,
      user.password,
      user.address,
      user.contact,
      user.role
    ];
    db.query(sql, values, callback);
  },

  /**
   * Find a user by email and password.
   * callback: function(err, user) -> user object or null
   * Password compared using SHA1(password)
   */
  findByEmailAndPassword: function (email, password, callback) {
    const sql = 'SELECT id, username, email, address, contact, role FROM users WHERE email = ? AND password = SHA1(?) LIMIT 1';
    db.query(sql, [email, password], function (err, results) {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  }
};

module.exports = User;