const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  const urls = [
    
    { origin: 'https://developer.mozilla.org/es/docs/Web/HTTP/Status', shortUrl: 'djg242' },
    { origin: 'www.google.com/nodejs', shortUrl: 'djg2432' },
    { origin: 'www.google.com/javascript', shortUrl: 'djg2445' }
  ];
  res.render("home", { urls });
});


module.exports = router