const express = require('express');
const db = require('../db');
const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
});

router.get('/', (req, res) => {
  res.redirect('/sqli/users');
});

router.all('/users', async (req, res) => {
  const methodData = req.method === 'POST' ? req.body : req.query;
  const { page = 1, limit = 5, sort = 'id', order = 'ASC' } = methodData;

  const columns = ['id', 'username', 'email', 'created_at'];
  const safeSort = columns.includes(sort) ? sort : 'id';

  const offset = (parseInt(page) - 1) * limit;
  const query = `SELECT * FROM users ORDER BY ${safeSort} ${order} LIMIT ? OFFSET ?`;

  try {
    const [users] = await db.query(query, [parseInt(limit), parseInt(offset)]);
    res.render('sqli/users', { users, page: parseInt(page), sort: safeSort, order });
  } catch (err) {
    res.send('SQL Error: ' + err.message);
  }
});

module.exports = router;