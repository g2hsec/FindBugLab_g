const express = require('express');
const router = express.Router();

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '로그인 필요' });
  res.json({ id: req.session.user.id });
});

module.exports = router;