const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // kosongkan jika default XAMPP
  database: "pwd_project", // sesuaikan dengan nama database kamu
});

// Route untuk menerima data dari form
app.post("/submit", (req, res) => {
  const { tipe, tanggal, kategori, jumlah, keterangan } = req.body;

  const sql = `INSERT INTO transaksi (tipe, tanggal, kategori, jumlah, keterangan) VALUES (?, ?, ?, ?, ?)`;
  const values = [tipe, tanggal, kategori, jumlah, keterangan];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Gagal menyimpan data:", err);
      return res.status(500).send("Gagal menyimpan data.");
    }
    // res.send("Data berhasil disimpan!");
    res.redirect("/");
  });
});

app.get("/data", (req, res) => {
  const sql = "SELECT * FROM transaksi ODER BY ID DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data : ", err);
      return res.status(500).send("Gagal mengambil data.");
    }
    res.json(results);
  })
})

// Server listening
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});