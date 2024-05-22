var express = require('express');
var session = require('express-session');
var router = express.Router();
var uudi = require('uuid');


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
renderHtml('/kodeAkun', 'code_account.html');
renderHtml('/labaRugi', 'jurnal_labaRugi.html');
renderHtml('/dataPinjaman', 'data_pinjaman.html');
renderHtml('/dataSimpanan', 'data_simpanan.html');
renderHtml('/jurnalHarian', 'jurnal_harian.html');
renderHtml('/jurnalUmum', 'jurnal_umum.html');
renderHtml('/bukuBesar', 'jurnal_bukuBesar.html');
renderHtml('/neracaSaldo', 'jurnal_neracaSaldo.html');
renderHtml('/dataMasuk', 'data_masuk.html');
module.exports = router;
