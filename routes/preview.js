const express = require('express');
const fetch   = require('node-fetch');     // npm install node-fetch@2
const cheerio = require('cheerio');        // npm install cheerio
const router  = express.Router();

router.get('/', async (req, res) => {
  const target = req.query.url;
  let data = null, error = null;

  if (target) {
    try {
      const response = await fetch(target);
      const html     = await response.text();
      const $        = cheerio.load(html);

      data = {
        url:         target,
        title:       $('head > title').text() || target,
        description: $('meta[name="description"]').attr('content') || '',
        image:       $('meta[property="og:image"]').attr('content')   || ''
      };
    } catch (e) {
      error = e.message;
    }
  }

  res.render('preview/preview', { data, error, target });
});

module.exports = router;
