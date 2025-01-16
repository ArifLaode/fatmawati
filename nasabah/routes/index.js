var express = require('express');
var router = express.Router();


// Define renderHtml function
function renderHtml(url, file) {
  router.get(url, function (req, res) {
    res.sendFile(file, {
      root: 'public'
    });
  });
};

// Setup routes
renderHtml('/', 'index.html');
renderHtml('/dashboard', 'dashboard.html');
module.exports = router;
