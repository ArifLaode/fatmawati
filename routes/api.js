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

getData('/dataAkun', 'tb_akun');

addData('/kodeAkun', 'tb_akun', 'id_akun');
editData('/editAkun', 'tb_akun', 'id_akun');
deleteData('/deleteAkun', 'tb_akun', 'id_akun');


router.post('/dataKoperasi', (req, res) => {
    var tb_name = 'tb_koperasi';
    const newData = req.body;
    const data = {
        id_akun: '9ca10809-04e',
        id_data: uuid.v4(),
        nama: newData.nama,
        NIK: newData.NIK,
        waktu: newData.waktu,
        nominal: newData.nominal,
        jangka: newData.jangka,
        no_hp: newData.no_hp
    }

    const sql = `INSERT INTO ${tb_name} SET ?`;

    db.query(sql, data, (err, result) => {
        if (err) {
            console.log(`Gagal menambahkan data ke tabel ${tb_name} dengan error: ${err}`);
            return res.status(500).send('Gagal menambahkan data.');
        } else {
            console.log(`Data berhasil ditambahkan ke tabel ${tb_name}`);
            return res.status(201).send('Data berhasil ditambahkan.');
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