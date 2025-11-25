// ...existing code...
const User = require('../models/User');

const UserController = {
  // 1. showRegister
  showRegister: function (req, res) {
    res.render('register', {
      messages: req.flash('error'),
      formData: req.flash('formData')[0] || {}
    });
  },

  // 2. register
  register: function (req, res) {
    const { username, email, password, address, contact, role } = req.body || {};

    if (!username || !email || !password || !address || !contact || !role) {
      req.flash('error', 'All fields are required.');
      req.flash('formData', req.body);
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password should be at least 6 characters long.');
      req.flash('formData', req.body);
      return res.redirect('/register');
    }

    const user = { username, email, password, address, contact, role };

    User.create(user, function (err, result) {
      if (err) {
        console.error(err);
        req.flash('error', 'Registration failed. Please try again.');
        req.flash('formData', req.body);
        return res.redirect('/register');
      }

      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/login');
    });
  },

  // 3. showLogin
  showLogin: function (req, res) {
    res.render('login', {
      messages: req.flash('success'),
      errors: req.flash('error')
    });
  },

  // 4. login
  login: function (req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/login');
    }

    User.findByEmailAndPassword(email, password, function (err, user) {
      if (err) {
        console.error(err);
        req.flash('error', 'Database error');
        return res.redirect('/login');
      }

      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      // store minimal user object in session
      req.session.user = {
        id: user.id || user.userId || user.user_id,
        username: user.username,
        role: user.role
      };

      req.flash('success', 'Login successful!');

      if (req.session.user.role === 'admin') return res.redirect('/inventory');
      return res.redirect('/shopping');
    });
  },

  // 5. logout
  logout: function (req, res) {
    req.session.destroy(function (err) {
      if (err) console.error(err);
      res.redirect('/login');
    });
  }
};

module.exports = UserController;
// ...existing code...