require('dotenv').config(); // Load biến môi trường từ file .env

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const UserModel = require('../model/users.model');
const VerifyModel = require('../model/verify.model');
const UserInfoModel = require('../model/user_info.model');

function generateRandomId(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateVerifyCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Multer config
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../assets/avatar');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar_${Date.now()}.jpg`);
  }
});

const backgroundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../assets/background');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `background_${Date.now()}.jpg`);
  }
});

const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');
const uploadBackground = multer({ storage: backgroundStorage }).single('background');

// Nodemailer config using .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Controller functions

const loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

  UserModel.findByEmail(email, async (err, users) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (users.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu sai vui lòng nhập lại' });

    VerifyModel.findLatestVerifyByUser(user.user_id, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi server' });

      if (result.length === 0 || result[0].verify_status === 0) {
        const code = generateVerifyCode();
        const verify_id = Date.now().toString();

        VerifyModel.createVerify({ verify_id, verify_code: code, verify_status: 0, user_id: user.user_id }, (err) => {
          if (err) return res.status(500).json({ message: 'Lỗi tạo mã xác minh' });

          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Mã xác minh OnSic',
            text: `Mã xác minh của bạn là: ${code}`,
          });

          return res.status(200).json({ status: 'unverified', message: 'Tài khoản chưa xác minh' });
        });
      } else {
        return res.status(200).json({
          status: 'verified',
          message: 'Đăng nhập thành công',
          user_id: user.user_id  // THÊM DÒNG NÀY
        });        
      }
    });
  });
};

const registerUser = (req, res) => {
  const { user_name, email, password } = req.body;
  if (!user_name || !email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  UserModel.findByUsername(user_name, (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (result.length > 0) return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });

    UserModel.findByEmail(email, async (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi server' });
      if (result.length > 0) return res.status(400).json({ message: 'Email đã tồn tại' });

      const user_id = generateRandomId();
      const hashedPassword = await bcrypt.hash(password, 10);

      UserModel.createUser({ user_id, user_name, email, password: hashedPassword }, (err) => {
        if (err) return res.status(500).json({ message: 'Lỗi server' });

        const userInfo = {
          user_info_id: generateRandomId(16),
          user_id,
        };

        UserInfoModel.createEmptyUserInfo(userInfo, (err) => {
          if (err) return res.status(500).json({ message: 'Lỗi tạo user_info' });

          const verify_id = generateRandomId(16);
          const verify_code = generateVerifyCode();

          const verify = {
            verify_id,
            verify_code,
            verify_status: 0,
            user_id,
          };

          VerifyModel.createVerify(verify, (err) => {
            if (err) return res.status(500).json({ message: 'Lỗi khi tạo mã xác minh' });

            transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Mã xác minh tài khoản OnSic',
              text: `Mã xác minh của bạn là: ${verify_code}`,
            }, (err) => {
              if (err) return res.status(500).json({ message: 'Gửi email thất bại' });
              return res.status(201).json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh' });
            });
          });
        });
      });
    });
  });
};

const verifyCode = (req, res) => {
  const { code, action } = req.body;
  if (!code) return res.status(400).json({ message: 'Thiếu mã xác minh' });

  VerifyModel.findVerifyCode(code, (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (result.length === 0) return res.status(400).json({ message: 'Mã xác thực sai' });

    const verifyData = result[0];

    if (action === 'reset') {
      return res.status(200).json({ message: 'Xác thực thành công. Mời đặt lại mật khẩu' });
    }

    if (verifyData.verify_status === 1) {
      return res.status(400).json({ message: 'Tài khoản đã xác minh rồi' });
    }

    VerifyModel.updateStatus(verifyData.verify_id, (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi cập nhật trạng thái' });
      return res.status(200).json({ message: 'Xác thực tài khoản thành công' });
    });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Thiếu email' });

  UserModel.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (result.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

    const user = result[0];
    const code = generateVerifyCode();
    const verify_id = generateRandomId(16);

    VerifyModel.createVerify({ verify_id, verify_code: code, verify_status: 0, user_id: user.user_id }, (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi tạo mã xác minh' });

      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã xác minh đổi mật khẩu',
        text: `Mã xác minh của bạn là: ${code}`,
      });

      return res.status(200).json({ message: 'Mã xác thực đã được gửi tới Email' });
    });
  });
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Thiếu thông tin' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    UserModel.updatePasswordByEmail(email, hashed, (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi cập nhật mật khẩu' });
      return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
  }
};

const uploadUserAvatar = (req, res) => {
  uploadAvatar(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi tải ảnh' });

    const { user_id } = req.body;
    const filename = `assets/avatar/${req.file.filename}`;

    UserModel.findByUserId(user_id, (err, users) => {
      if (err || users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      UserInfoModel.updateByUserId(user_id, { user_avatar: filename }, (err) => {
        if (err) return res.status(500).json({ message: 'Lỗi cập nhật avatar' });
        return res.status(200).json({ message: 'Thành công', filename });
      });
    });
  });
};

const updateUserBackground = (req, res) => {
  uploadBackground(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi tải ảnh nền' });

    const { user_id } = req.body;
    const filename = `assets/background/${req.file.filename}`;

    UserModel.findByUserId(user_id, (err, users) => {
      if (err || users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      UserInfoModel.updateByUserId(user_id, { user_background: filename }, (err) => {
        if (err) return res.status(500).json({ message: 'Lỗi cập nhật ảnh nền' });
        return res.status(200).json({ message: 'Cập nhật ảnh nền thành công', filename });
      });
    });
  });
};

const getUserInfo = (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'Thiếu user_id' });

  UserModel.findByUserId(user_id, (err, users) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const user = users[0];
    const user_email = user.email;

    UserInfoModel.getByUserId(user_id, (err, info) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy user_info' });

      const user_background = info[0]?.user_background || null;
      const user_avatar = info[0]?.user_avatar || null;
      const user_dob = info[0]?.user_dob || null;
      const user_phone = info[0]?.user_phone || null;
      const user_bio = info[0]?.user_bio || null;
      const user_add = info[0]?.user_add || null;

      return res.status(200).json({
        status: 'success',
        user_id: user.user_id,
        user_name: user.user_name,
        email: user_email,
        user_background,
        user_avatar,
        user_dob,
        user_phone,
        user_bio,
        user_add,
      });
    });
  });
};

const updateUserInfo = (req, res) => {
  const { user_id, user_name, user_dob, user_phone, user_add, user_bio } = req.body;

  if (!user_id) return res.status(400).json({ message: 'Thiếu user_id' });

  // 1. Cập nhật bảng users
  UserModel.updateUserNameById(user_id, user_name, (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật tên người dùng' });

    // 2. Cập nhật bảng user_info
    const updates = {};
    if (user_dob) updates.user_dob = user_dob;
    if (user_phone) updates.user_phone = user_phone;
    if (user_add) updates.user_add = user_add;
    if (user_bio) updates.user_bio = user_bio;

    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ message: 'Cập nhật thành công (chỉ tên)' });
    }

    UserInfoModel.updateByUserId(user_id, updates, (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi cập nhật thông tin người dùng' });
      return res.status(200).json({ message: 'Cập nhật thông tin thành công' });
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyCode,
  forgotPassword,
  resetPassword,
  getUserInfo,
  updateUserBackground,
  uploadUserAvatar,
  updateUserInfo
};
