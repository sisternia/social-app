const express = require('express');
const router = express.Router();
const ArticlesController = require('../controller/articles.controller');

router.post('/create', ArticlesController.createArticle);
router.get('/get', ArticlesController.getArticlesByUserId);

module.exports = router;
