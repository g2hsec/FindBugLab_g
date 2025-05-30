const express = require('express');
const db = require('../db');
const router = express.Router();

function escapeOnce(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function blacklistFilter(str) {
  const norm = str.toLowerCase().replace(/[\s\t]+/g, '');
  if (/script/.test(norm)) return '[blocked]';
  return str;
}

router.get('/', async (req, res) => {
  const raw = req.query.keyword || '';
  const filtered = blacklistFilter(raw);
  const escapedKeyword = escapeOnce(filtered);

  let query = "SELECT * FROM posts";
  if (raw) {
    query += ` WHERE title LIKE '%${raw}%' OR content LIKE '%${raw}%' OR author LIKE '%${raw}%'`;
  }
  query += " ORDER BY id DESC";

  try {
    const [posts] = await db.query(query);
    const safePosts = posts.map(p => ({
      ...p,
      title: escapeOnce(blacklistFilter(p.title)),
      author: escapeOnce(blacklistFilter(p.author)),
      is_private: p.is_private,
      id: p.id,
      created_at: p.created_at
    }));
    res.render('xss/list', { posts: safePosts, keyword: escapedKeyword });
  } catch (err) {
    res.send(`SQL 에러: ${err.message}`);
  }
});

router.get('/write', (req, res) => {
  res.render('xss/write');
});

router.post('/write', async (req, res) => {
  const { title, content, author, password, is_private } = req.body;
  const priv = is_private ? 1 : 0;
  await db.query(
    "INSERT INTO posts (title, content, author, password, is_private) VALUES (?, ?, ?, ?, ?)",
    [title, content, author, password, priv]
  );
  res.redirect('/xss');
});

router.get('/view/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
  const post = rows[0];
  if (!post) return res.send('❌ 글이 존재하지 않습니다.');

  const isAuthenticated = req.session.authenticatedPosts?.[id];
  if (post.is_private && !isAuthenticated) {
    return res.render('xss/password-check', {
      id: post.id,
      purpose: 'view',
      message: '이 글은 비밀글입니다. 비밀번호를 입력하세요.'
    });
  }

  post.title = escapeOnce(blacklistFilter(post.title));
  post.author = escapeOnce(blacklistFilter(post.author));
  post.content = escapeOnce(blacklistFilter(post.content));
  res.render('xss/view', { post });
});

router.get('/edit/:id', async (req, res) => {
  const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [req.params.id]);
  res.render('xss/edit', { post: rows[0] });
});

router.post('/edit/:id', async (req, res) => {
  const { title, content } = req.body;
  await db.query("UPDATE posts SET title=?, content=? WHERE id=?", [title, content, req.params.id]);
  res.redirect('/xss/view/' + req.params.id);
});

router.get('/delete/:id', async (req, res) => {
  await db.query(`DELETE FROM posts WHERE id = ${req.params.id}`);
  res.redirect('/xss');
});

router.post('/verify', async (req, res) => {
  const { id, password, purpose } = req.body;
  const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
  if (rows.length === 0 || rows[0].password !== password) {
    return res.send("<script>alert('비밀번호가 틀렸습니다.');history.back();</script>");
  }

  if (!req.session.authenticatedPosts) req.session.authenticatedPosts = {};
  req.session.authenticatedPosts[id] = true;

  if (purpose === 'view') return res.redirect('/xss/view/' + id);
  if (purpose === 'edit') return res.redirect('/xss/edit/' + id);
  if (purpose === 'delete') return res.redirect('/xss/delete/' + id);
  return res.send("✅ 인증 성공했지만 purpose 파라미터가 잘못되었습니다.");
});

router.get('/verify-form/:id', async (req, res) => {
  const id = req.params.id;
  const purpose = req.query.purpose || 'view';
  res.render('xss/password-check', {
    id,
    purpose,
    message: `${purpose.toUpperCase()}를 위해 비밀번호를 입력하세요.`
  });
});

module.exports = router;
