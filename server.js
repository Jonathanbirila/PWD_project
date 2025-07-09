const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;
const keuanganRoute = require('./routes/keuangan'); // sesuaikan dengan path sebenarnya


app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.json());
app.use('/api', keuanganRoute);


// Koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kasnote'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Terhubung ke database MySQL!');
});

// ======================= API KEUANGAN =======================

// Ambil data hanya milik user login
app.get('/api/keuangan', (req, res) => {
  const userId = req.query.userId;

  if (!userId) return res.status(400).json({ error: 'User ID diperlukan.' });

  db.query(
    'SELECT * FROM transaksi WHERE user_id = ? ORDER BY id DESC',
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// Tambah data transaksi
app.post('/api/keuangan', (req, res) => {
    console.log("📦 Data diterima:", req.body);

    const { tanggal, kategori, jumlah, keterangan, userId } = req.body;

    const sql = 'INSERT INTO transaksi (tanggal, kategori, jumlah, keterangan, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [tanggal, kategori, jumlah, keterangan, userId], (err, result) => {
        if (err) {
            console.error('Gagal menyimpan data:', err);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }
        res.status(200).json({ message: 'Data berhasil disimpan' });
    });
});


// Update data transaksi (dengan validasi user)
app.put('/api/keuangan/:id', (req, res) => {
  const { id } = req.params;
  const { tanggal, keterangan, kategori, jumlah, userId } = req.body;

  // Pastikan transaksi milik user yang benar
  db.query('SELECT * FROM transaksi WHERE id = ? AND user_id = ?', [id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(403).json({ error: 'Tidak diizinkan mengedit data ini.' });

    db.query(
      'UPDATE transaksi SET tanggal = ?, keterangan = ?, kategori = ?, jumlah = ? WHERE id = ?',
      [tanggal, keterangan, kategori, jumlah, id],
      err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, tanggal, keterangan, kategori, jumlah });
      }
    );
  });
});

// Hapus transaksi milik user
app.delete('/api/keuangan/:id', (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  db.query('SELECT * FROM transaksi WHERE id = ? AND user_id = ?', [id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(403).json({ error: 'Tidak diizinkan menghapus data ini.' });

    db.query('DELETE FROM transaksi WHERE id = ?', [id], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(204);
    });
  });
});

// ======================= LOGIN & REGISTER =======================

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        res.json({ userId: results[0].id, username });
      } else {
        res.status(401).json({ error: 'Username atau password salah!' });
      }
    }
  );
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.length > 0) {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Gagal menyimpan user' });

        res.json({ userId: result.insertId, username });
      }
    );
  });
});

// ======================= SERVE HALAMAN =======================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
