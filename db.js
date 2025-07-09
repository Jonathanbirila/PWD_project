// File: db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',          // sesuaikan
  password: '',          // sesuaikan
  database: 'kasnote',   // sesuaikan dengan nama database kamu
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
