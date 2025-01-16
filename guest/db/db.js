var mysql = require('mysql2')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imin'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database');
});

module.exports = db;