const db = require('../db/db');

const UserModel = {
  findByUsername: (user_name, callback) => {
    db.query('SELECT * FROM users WHERE user_name = ?', [user_name], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  createUser: (user, callback) => {
    db.query('INSERT INTO users SET ?', user, callback);
  },

  updatePasswordByEmail: (email, hashedPassword, callback) => {
    db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], callback);
  }
};

module.exports = UserModel;