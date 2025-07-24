    const db = require('../db/db');

    const ArticlesMediaModel = {
    uploadMedia: (media, callback) => {
        db.query('INSERT INTO articles_media SET ?', media, callback);
    },

    getMediaByUserId: (user_id, callback) => {
        db.query(`
        SELECT m.* FROM articles_media m
        JOIN articles a ON m.articles_id = a.articles_id
        WHERE a.user_id = ?
        `, [user_id], callback);
    },

    getMediaByArticleId: (articles_id, callback) => {
        db.query('SELECT * FROM articles_media WHERE articles_id = ?', [articles_id], callback);
    },

    getMediaByMediaId: (media_id, callback) => {
        db.query('SELECT * FROM articles_media WHERE media_id = ?', [media_id], callback);
    }
    };

    module.exports = ArticlesMediaModel;
