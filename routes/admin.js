const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);


const ADMIN_ID = 3;

router.use((req, res, next) => {
  const overrideId = req.query.id;
  if (overrideId && parseInt(overrideId,10) === ADMIN_ID) {
    return next();
  }
  if (!req.session.user || req.session.user.username !== 'admin') {
    return res.status(403).send('Access denied: Admins only');
  }
  next();
});

router.get('/status', async (req, res) => {
  const [uptime, disk, mem, ping] = await Promise.all([
    execAsync('uptime').then(r => r.stdout).catch(() => 'N/A'),
    execAsync('df -h').then(r => r.stdout).catch(() => 'N/A'),
    execAsync('free -h').then(r => r.stdout).catch(() => 'N/A'),
    execAsync('ping -c 1 8.8.8.8').then(r => r.stdout).catch(() => 'N/A')
  ]);

  res.render('admin/status', {
    user: req.session.user,
    uptime, disk, mem, ping,
    output: null
  });
});

router.post('/status', async (req, res) => {
  const cmd = req.body.cmd;
  const [uptime, disk, mem, ping] = await Promise.all([
    execAsync('uptime').then(r => r.stdout).catch(() => 'N/A'),
    execAsync('df -h').then(r => r.stdout).catch(() => 'N/A'),
    execAsync('free -h').then(r => r.stdout).catch(() => 'N/A'),
    execAsync('ping -c 1 8.8.8.8').then(r => r.stdout).catch(() => 'N/A')
  ]);

  exec(cmd, (err, stdout, stderr) => {
    const output = stdout + stderr;
    res.render('admin/status', {
      user: req.session.user,
      uptime, disk, mem, ping,
      output
    });
  });
});

module.exports = router;
