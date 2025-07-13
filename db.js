// File: db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',          // sesuaikan
  database: 'kasnote',   // sesuaikan dengan nama database kamu
  password: '',          // sesuaikan
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
