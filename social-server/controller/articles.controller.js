const ArticlesModel = require('../model/articles.model');
const { v4: uuidv4 } = require('uuid');

const formatDate = (date) => {
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const d = new Date(date);
  const day = days[d.getDay()];
  const dateNum = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  return `${day}, ${dateNum} tháng ${month}, ${year} lúc ${hour}:${minute}`;
};

const ArticlesController = {
  createArticle: (req, res) => {
    const { user_id, articles_content, articles_object } = req.body;

    if (!user_id || (!articles_content && !req.file)) {
      return res.status(400).json({ status: 'error', message: 'Thiếu dữ liệu bắt buộc' });
    }

    const article = {
      articles_id: uuidv4().slice(0, 10),
      articles_content,
      articles_object,
      user_id,
    };

    ArticlesModel.createArticle(article, (err, result) => {
      if (err) return res.status(500).json({ status: 'error', message: 'Lỗi server' });
      return res.status(200).json({ status: 'success', article_id: article.articles_id });
    });
  },

  getArticlesByUserId: (req, res) => {
    const { user_id } = req.query;

    ArticlesModel.getArticlesByUserId(user_id, (err, results) => {
      if (err) return res.status(500).json({ status: 'error', message: 'Lỗi truy vấn' });

      const formatted = results.map((article) => ({
        ...article,
        created_at: formatDate(article.created_at),
        updated_at: formatDate(article.updated_at),
      }));

      return res.status(200).json({ status: 'success', articles: formatted });
    });
  },
};

module.exports = ArticlesController;
