const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db')
const router = express.Router();

router.get('/register', (req, res) => {
	res.render('register', {message: null });
});
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.render('register', { message: '모든 필드를 입력하세요.' });
  }

  const [existing] = await db.query(
    "SELECT * FROM users WHERE username = ?", [username]
  );
  if (existing.length > 0) {
    return res.render('register', { message: '이미 존재하는 사용자입니다.' });
  }

  await db.query(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, password, email]
  );
  res.redirect('/login');
});
router.get('/login', (req, res) => {
	res.render('login', {message: null });
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  const query = `
    SELECT * 
      FROM users 
     WHERE username = '${username}'
  `;
  console.log('SQL:', query);
  const [rows] = await db.query(query);

  if (rows.length === 0) {
    return res.render('login', { message: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
  }

  const user = rows[0];

if (password !== user.password) {
  return res.render('login', { message: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
}
  req.session.user = { id: user.id, username: user.username };
  res.redirect('/');
});
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/mypage', async (req, res) => {
  if (!req.session.user) 
    return res.status(401).send('로그인 후 접근 가능합니다.');

  const userId = req.session.user.id;

  const [posts] = await db.query(
    "SELECT id, title, created_at FROM posts WHERE author = ? ORDER BY created_at DESC LIMIT 5",
    [ userId ]
  );

  res.render('mypage', {
    user: req.session.user,
    posts
  });
});


module.exports = router;
