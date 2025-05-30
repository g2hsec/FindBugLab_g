const express = require('express');
const router = express.Router();
const db = require('../db');

router.use((req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
});

router.get('/', (req, res) => {
  res.render('mypage', { layout: false });
});

router.get('/data', async (req, res) => {
  const id = req.query.id;  
  try {
    const [users] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    const [posts] = await db.query(
      'SELECT id, title, created_at FROM posts WHERE author = ? ORDER BY created_at DESC LIMIT 5',
      [id]
    );
    if (!users.length) return res.status(404).json({ error: '사용자 없음' });
    return res.json({ user: users[0], posts });
  } catch (err) {
    console.error('DB 오류:', err);
    return res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;