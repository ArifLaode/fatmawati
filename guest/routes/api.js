var express = require('express');
var router = express.Router();
var db = require('../db/db');
const uuid = require('uuid');
const fs = require('fs');



// Function to get data
function getData(url, tb_name) {
    var sql = `SELECT * FROM ${tb_name}`;
    router.get(url, (req, res) => {
        db.query(sql, (err, data) => {
            if (err) {
                console.log(`Tidak bisa mengambil data di tabel ${tb_name} dengan error: ${err}`);
                return res.status(500).send('Gagal mengambil data.');
            } else {
                return res.send(data);
            }
        });
    });
}

router.get('/jurnalApis', (req, res) => {
    var sql = `SELECT * FROM tb_koperasi as tk INNER JOIN tb_akun as ta WHERE tk.id_akun = ta.id_akun`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`Data tidak dapat diambil`, err);
        } else {
            res.send(data);
        }
    });
});

router.get('/dataPinjam', (req, res) => {
    var sql = `SELECT * FROM tb_koperasi WHERE id_akun = ?`;
    var id_akun = '9ca10809-04e'
    db.query(sql, [id_akun], (err, data) => {
        if (err) {
            console.log(`Tidak bisa mengambil data di tabel dengan error: ${err}`);
            return res.status(500).send('Gagal mengambil data.');
        } else {
            return res.send(data);
        }
    });
});

router.get('/dataSimpanan', (req, res) => {
    var sql = `SELECT * FROM tb_koperasi WHERE id_akun = 74cd23ca-84b`;
    db.query(sql, (err, data) => {
        if (err) {
            console.log(`Tidak bisa mengambil data di tabel dengan error: ${err}`);
            return res.status(500).send('Gagal mengambil data.');
        } else {
            return res.send(data);
        }
    });
});

router.post('/dataCicil', (req, res) => {
    const filePath = "./public/data/data_pinjaman.json";
    const requestData = req.body;
    const dataJson = {
        id_data: requestData.id_data,
        jangka: requestData.jangka,
        record: requestData.record
    }
    console.log(requestData);

    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            console.error(`Gagal membaca file ${filePath}: ${err}`);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Konversi data yang sudah ada menjadi array
        let dataArray = JSON.parse(fileData);

        // Cari index data dengan id_data yang sama
        const existingIndex = dataArray.findIndex(item => item.id_data === dataJson.id_data);

        if (existingIndex !== -1) {
            // Jika data dengan id_data yang sama sudah ada, lakukan rewrite pada record
            dataArray[existingIndex].record = dataArray[existingIndex].record - 1;
        } else {
            dataArray.push(dataJson);
        }

        // Konversi array kembali ke format JSON
        const jsonData = JSON.stringify(dataArray, null, 2);

        // Tulis kembali ke file
        fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
            if (err) {
                console.error(`Gagal menulis ke file ${filePath}: ${err}`);
                return res.status(500).send('Internal Server Error');
                return;
            }
            console.log(`Data baru berhasil ditambahkan ke dalam file ${filePath}`);
            return res.status(200).send('Data baru berhasil ditambahkan');
        });
    });

    // Menggunakan nilai dataJson.record untuk sqlData
    var sql = `INSERT INTO tb_koperasi SET ?`;
    var sqlData = {
        id_data: uuid.v4(),
        id_akun: '4c2af1e0-279',
        nama: requestData.nama,
        NIK: requestData.NIK,
        waktu: requestData.waktu,
        nominal: requestData.nominal,
        jangka: '-',
        no_hp: requestData.no_hp,
        record: dataJson.record // Menggunakan nilai record dari dataJson
    }

    db.query(sql, [sqlData], (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Data berhasil dikirim ke SQL');
        }
    });
});

getData('/dataAkun', 'tb_akun');


router.get('/dataSimpan', (req, res) => {
    var sql = 'SELECT * FROM tb_koperasi WHERE id_akun = ?';
    var id_akun = '74cd23ca-84b';
    db.query(sql, [id_akun], (err, data) => {
        if (err) {
            console.log('Tidak dapat mengambil data', err);
        } else {
            return res.send(data);
        }
    });
});

router.get('/dataKoperasi', function (req, res) {
    var sql = 'SELECT * FROM tb_koperasi as tk INNER JOIN tb_akun as ta WHERE tk.id_akun = ta.id_akun';
    db.query(sql, function (err, data) {
        if (err) {
            console.log('Tidak dapat mengambil data', err);
        } else {
            // return res.send(data);
            const dataFill = data.map(row => ({
                nama: row.nama,
                date: formatDate(row.waktu),
                nominal: row.nominal,
                posisi: row.posisi_saldo
            }));

            return res.send(dataFill);
        }
    });
})

function formatDate(date) {
    const dateObj = new Date(date);

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}-${month}-${year}`
}


// Export the router
module.exports = router;