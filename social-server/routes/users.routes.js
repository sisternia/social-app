const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyCode,
  forgotPassword,
  resetPassword,
  getUserInfo,
  updateUserBackground,
  uploadUserAvatar
} = require('../controller/users.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/info', getUserInfo);
router.post('/background', updateUserBackground);
router.post('/avatar', uploadUserAvatar);

module.exports = router;
