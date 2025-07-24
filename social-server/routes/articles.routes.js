const express = require('express');
const router = express.Router();
const ArticlesController = require('../controller/articles.controller');

router.post('/create', ArticlesController.createArticle);
router.get('/get', ArticlesController.getArticlesByUserId);
router.post('/upload-media', ArticlesController.uploadMedia);
router.get('/media/user', ArticlesController.getMediaByUserId);
router.get('/media/article', ArticlesController.getMediaByArticleId);
router.get('/media/id', ArticlesController.getMediaByMediaId);

module.exports = router;
