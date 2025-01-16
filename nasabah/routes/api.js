var express = require('express');
var router = express.Router();
var db = require('../db/db');


router.post('/login', function(req, res) {
    const { NIK, nama } = req.body;
    console.log(NIK, nama);
    const sql = `SELECT * FROM tb_koperasi WHERE NIK = '${NIK}'`;
    db.query(sql, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            if (result.length > 0) {
                res.send({ status: 200, message: 'Login berhasil', data: result[0] });
            } else {
                res.send({ status: 500, message: 'Login gagal' });
            }
        }
    });
});


router.get('/data-pinjaman', function(req, res) {
    const sql = `SELECT * FROM tb_koperasi as tk inner join tb_simpanpinjam as ts on tk.id_data = ts.id_data`;
    db.query(sql, (err, result) => {
        if (err) {
            res.send(err);
            console.log(err);
        }
        else {
            res.send(result);
        }
})
});


// Export the router
module.exports = router;