const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users.routes');
require('dotenv').config();

const app = express(); // ⬅️ PHẢI khai báo trước khi dùng `app`

const PORT = 3001;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ✅ Serve static files (ảnh avatar)
app.use('/assets', express.static('assets')); // ⬅️ Bây giờ KHÔNG còn lỗi

// ✅ API routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://192.168.1.9:${PORT}`);
});
