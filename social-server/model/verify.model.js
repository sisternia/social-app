const db = require('../db/db');

const VerifyModel = {
  createVerify: (verify, cb) => {
    db.query('INSERT INTO verify SET ?', verify, cb);
  },

  findVerifyCode: (code, cb) => {
    db.query('SELECT * FROM verify WHERE verify_code = ?', [code], cb);
  },

  updateStatus: (id, cb) => {
    db.query('UPDATE verify SET verify_status = 1 WHERE verify_id = ?', [id], cb);
  },

  findLatestVerifyByUser: (user_id, cb) => {
    db.query(
      'SELECT * FROM verify WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id],
      cb
    );
  },
};

module.exports = VerifyModel;
