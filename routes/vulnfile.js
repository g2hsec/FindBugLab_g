const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const fetch   = require('node-fetch');
const router  = express.Router();

const UP = path.join(__dirname, '../uploads/');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UP);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });



router.use((req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
});

router.get('/', (req, res) => {
  const files = fs.readdirSync(UP).map(name=>{
    const s = fs.statSync(path.join(UP,name));
    return { name, size: s.size, mtime: s.mtime };
  });
  res.render('files/index', { user: req.session.user, files });
});

router.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/files');
});

router.get('/download/:name', (req, res) => {
  const target = decodeURIComponent(req.params.name);
  const fp     = path.join(UP, target);
  if (!fs.existsSync(fp)) return res.status(404).send('Not found');

  return res.download(fp, target, {
    headers: {
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(target)}`
    }
  });
});

router.get('/delete/:name', (req, res) => {
  try { fs.unlinkSync(path.join(UP, req.params.name)); }
  catch {}
  res.redirect('/files');
});

router.get('/preview', async (req, res) => {
  const src = req.query.src;
  try {
    if (/^https?:\/\//.test(src)) {
      const r = await fetch(src);
      const contentType = r.headers.get('content-type') || 'text/plain';
      const buffer = await r.arrayBuffer();
      res.set('Content-Type', contentType);
      return res.send(Buffer.from(buffer));
    }

    const filePath = path.isAbsolute(src) ? src : path.join(UP, decodeURIComponent(src));
    if (!fs.existsSync(filePath)) throw new Error('Not found');
    const ext = path.extname(filePath).toLowerCase();

    if (['.png','.jpg','.jpeg','.gif','.webp','.svg'].includes(ext)) {
      return res.sendFile(filePath);
    }

    const text = fs.readFileSync(filePath, 'utf8');
    res.set('Content-Type', 'text/plain; charset=utf-8');
    return res.send(text);

  } catch (e) {
    res.send(`Preview Error: ${e.message}`);
  }
});

module.exports = router;
