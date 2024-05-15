const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imin'
});

db.connect((err) => {
    if (err) {
        console.log('Terjadi Kesalahan pada Database ', +err);
    } else {
        console.log('Database terkoneksi');
    }
});

module.exports = db;