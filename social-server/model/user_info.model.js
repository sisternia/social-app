const db = require('../db/db');

const UserInfoModel = {
  createEmptyUserInfo: (userInfo, callback) => {
    const query = `
      INSERT INTO user_info (user_info_id, user_phone, user_add, user_bio, user_avatar, user_background, user_id)
      VALUES (?, NULL, NULL, NULL, NULL, NULL, ?)
    `;
    const values = [userInfo.user_info_id, userInfo.user_id];
    db.query(query, values, callback);
  },

  getByUserId: (user_id, callback) => {
    db.query('SELECT * FROM user_info WHERE user_id = ?', [user_id], callback);
  },

  updateByUserId: (user_id, updates, callback) => {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(updates), user_id];

    db.query(`UPDATE user_info SET ${fields} WHERE user_id = ?`, values, callback);
  }
};

module.exports = UserInfoModel;
