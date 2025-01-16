var express = require('express');
var router = express.Router();
var db = require('../db/db');
const uuid = require('uuid');
const fs = require('fs');
const session = require('express-session');

// Setup express-session middleware
router.use(session({
    secret: uuid.v4(), // Panggil uuid.v4() untuk menghasilkan secret UUID
    resave: false,
    saveUninitialized: true
}));

router.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // Kueri SQL untuk mencari pengguna dengan email dan password yang sesuai
    const query = 'SELECT * FROM tb_user WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Kesalahan Query: ', err.stack);
            return res.status(500).send('Kesalahan server');
        }

        if (results.length > 0) {
            // Autentikasi berhasil
            req.session.user = email;
            return res.redirect('/');
        } else {
            // Autentikasi gagal
            return res.redirect('/login');
        }
    });
});



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

function addData(url, tb_name, idColumnName) {
    router.post(url, (req, res) => {
        const newData = req.body;
        newData[idColumnName] = uuid.v4(); // Assuming you have imported uuid
        console.log(newData);

        const sql = `INSERT INTO ${tb_name} SET ?`;

        db.query(sql, newData, (err, result) => {
            if (err) {
                console.log(`Gagal menambahkan data ke tabel ${tb_name} dengan error: ${err}`);
                return res.status(500).send('Gagal menambahkan data.');
            } else {
                console.log(`Data berhasil ditambahkan ke tabel ${tb_name}`);
                return res.status(201).send('Data berhasil ditambahkan.');
            }
        });
    });
}

// Function to delete data
function deleteData(url, tb_name, idColumnName) {
    router.post(url, (req, res) => {
        var id_akun = req.body.id_akun;
        console.log('Request received to delete data with id_akun:', id_akun);

        var sql = `DELETE FROM ${tb_name} WHERE ${idColumnName} = ?`;
        db.query(sql, id_akun, (err, data) => {
            if (err) {
                console.log(`Terjadi kesalahan: ${err}`);
                return res.status(500).send('Gagal menghapus data.');
            } else {
                console.log('Data berhasil dihapus');
                return res.status(200).send('Data berhasil dihapus.');
            }
        });
    });
}


function editData(url, tb_name, idColumnName) {
    router.post(url, (req, res) => {
        const newData = req.body;
        const id = req.body.id_akun;
        console.log('Received edit request:', newData);

        const sql = `UPDATE ${tb_name} SET ? WHERE ${idColumnName} = ?`;

        db.query(sql, [newData, id], (err, result) => {
            if (err) {
                console.log(`Gagal mengedit data di tabel ${tb_name} dengan error: ${err}`);
                return res.status(500).send('Gagal mengedit data.');
            } else {
                console.log(`Data berhasil diedit di tabel ${tb_name}`);
                return res.status(200).send('Data berhasil diedit.');
            }
        });
        console.log(id);
    });
}

router.get('/dataPinjam', (req, res) => {
    var sql = `
        SELECT 
            tb_koperasi.id_akun, 
            tb_koperasi.nama, 
            tb_koperasi.id_data, 
            tb_koperasi.nominal, 
            tb_simpanpinjam.cicilan, 
            tb_koperasi.waktu, 
            tb_koperasi.jangka, 
            tb_simpanpinjam.terbayar
        FROM tb_koperasi 
        INNER JOIN tb_simpanpinjam 
        ON tb_koperasi.id_data = tb_simpanpinjam.id_data 
        WHERE tb_koperasi.id_akun = ?`;
    
    var id_akun = '9ca10809-04e'; // Ganti dengan ID lengkap
    db.query(sql, [id_akun], (err, data) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Gagal mengambil data dari database.' });
        }
        const dataSend = data.map(item => ({
            id_akun: item.id_akun,
            id_data: item.id_data,
            nama: item.nama,
            nominal: item.nominal,
            cicilan: item.cicilan,
            waktu: item.waktu,
            jangka: item.jangka,
            terbayar: item.terbayar,
        }));
        return res.json(dataSend);
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

getData('/dataAkun', 'tb_akun');

addData('/kodeAkun', 'tb_akun', 'id_akun');
editData('/editAkun', 'tb_akun', 'id_akun');
deleteData('/deleteAkun', 'tb_akun', 'id_akun');


router.post('/dataKoperasi', (req, res) => {
    const tb_name = 'tb_koperasi';
    const idData = uuid.v4();
    const newData = req.body;

    // Data untuk tb_koperasi
    const data = {
        id_akun: '9ca10809-04e',
        id_data: idData,
        nama: newData.nama,
        NIK: newData.NIK,
        waktu: newData.waktu,
        nominal: newData.nominal,
        jangka: newData.jangka,
        no_hp: newData.no_hp,
    };

    // Data untuk tb_simpanpinjam
    const data2 = {
        ID: uuid.v4(),
        id_data: idData,
        nama: newData.nama,
        nominal: newData.nominal,
        tempo: newData.jangka,
        bunga: newData.bunga,
        cicilan: newData.cicilan,
        terbayar: 0,
    };

    // Query pertama: Insert ke tb_koperasi
    const sql = `INSERT INTO ${tb_name} SET ?`;
    const sql2 = `INSERT INTO tb_simpanpinjam SET ?`;

    db.query(sql, data, (err, result) => {
        if (err) {
            console.error(`Gagal menambahkan data ke tabel ${tb_name} dengan error: ${err}`);
            return res.status(500).send('Gagal menambahkan data ke tb_koperasi.');
        }

        console.log(`Data berhasil ditambahkan ke tabel ${tb_name}`);

        // Query kedua: Insert ke tb_simpanpinjam (hanya jika query pertama berhasil)
        db.query(sql2, data2, (err, result) => {
            if (err) {
                console.error(`Gagal menambahkan data ke tabel simpanpinjam dengan error: ${err}`);
                return res.status(500).send('Gagal menambahkan data ke tb_simpanpinjam.');
            }

            console.log('Data berhasil ditambahkan ke tabel simpanpinjam');
            return res.status(201).send('Data berhasil ditambahkan ke kedua tabel.');
        });
    });
});

router.post('/dataCicil', (req, res) => {
        const data = req.body;
        console.log(data);
        const update = data.terbayar + 1;
        const sql = 'update tb_simpanpinjam set ? where ID = ?';
        db.query(sql, update, data.ID), (err, result) => {
            if (err) {
                console.log('terjadi kesalahan dalam update pinjaman');
                return res.status(500).send('terjadi kesalahan server');
            } 
            return res.status(201).send('data berhasil dikirmkan');
        }
    });


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

router.post('/dataSimpanan', (req, res) => {
    var sql = `INSERT INTO tb_koperasi SET ?`;
    var bodyReq = req.body;
    var data = {
        id_data: uuid.v4(),
        id_akun: '74cd23ca-84b',
        nama: bodyReq.nama,
        NIK: bodyReq.NIK,
        waktu: bodyReq.waktu,
        nominal: bodyReq.nominal,
        jangka: bodyReq.jangka,
        no_hp: bodyReq.no_hp
    }
    console.log(bodyReq);
    db.query(sql, [data], (err) => {
        if (err) {
            console.log('Kesalahan saat mengirim data: ', err);
        } else {
            console.log(`Berhasil menyimpan data simpanan`);
        }
    });
});

router.post('/klaimSimpanan', (req, res) => {
    var sql = `INSERT INTO tb_koperasi SET ?`;
    var bodyReq = req.body;
    var data = {
        id_data: uuid.v4(),
        id_akun: '3fa0b5c0-67e',
        nama: bodyReq.nama,
        NIK: bodyReq.NIK,
        waktu: bodyReq.waktu,
        nominal: bodyReq.nominal,
        jangka: bodyReq.jangka,
        no_hp: bodyReq.no_hp
    }
    console.log(bodyReq);
    const filePath = './public/data/data.json'

    let existingData = [];
    try {
        const existingDataString = fs.readFileSync(filePath, 'utf8');
        existingData = JSON.parse(existingDataString);
    } catch (err) {
        // File mungkin belum ada atau tidak valid JSON
        console.error('Error reading existing file:', err);
    }

    // Data JSON yang akan ditambahkan ke array
    const newData = {
        id_data: bodyReq.id,
        status: bodyReq.status
    };

    // Pengecekan apakah id_data sudah ada dalam array
    const isIdDataExists = existingData.some(item => item.id_data === newData.id_data);

    if (!isIdDataExists) {
        // Tambahkan data baru ke dalam array
        existingData.push(newData);

        // Tulis array kembali ke file
        fs.writeFile(filePath, JSON.stringify(existingData), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Data JSON berhasil ditambahkan dan disimpan ke file:', filePath);
            }
        });
    } else {
        console.log('Data dengan id_data yang sama sudah ada. Tidak perlu menulis ulang.');
    }

    db.query(sql, [data], (err) => {
        if (err) {
            console.log('Kesalahan saat mengirim data: ', err);
        } else {
            console.log(`Berhasil menyimpan data simpanan`);
        }
    });
})

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

router.post('/newData', (req, res) => {
    const data = req.body;
    const pushData = {
        id_data: uuid.v4(),
        nama: data.jenis,
        id_akun: data.id_akun,
        waktu: data.waktu,
        nominal: data.nominal,
        ket: data.ket
    };

    const sql = `INSERT INTO tb_koperasi SET ?`;
    db.query(sql, [pushData], (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Gagal menambahkan data' });
        } else {
            console.log('Data berhasil ditambahkan');
            res.status(200).json({ message: 'Data berhasil ditambahkan' });
        }
    });
});



// Export the router
module.exports = router;