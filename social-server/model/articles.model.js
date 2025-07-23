const db = require('../db/db');

const ArticlesModel = {
  createArticle: (article, callback) => {
    db.query('INSERT INTO articles SET ?', article, callback);
  },

  getArticlesByUserId: (user_id, callback) => {
    db.query('SELECT * FROM articles WHERE user_id = ? ORDER BY created_at DESC', [user_id], callback);
  }
};

module.exports = ArticlesModel;
