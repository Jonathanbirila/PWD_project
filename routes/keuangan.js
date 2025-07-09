// routes/keuangan.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // sesuaikan dengan letak file koneksi DB kamu

router.get('/keuangan', async (req, res) => {
    const { userId, bulan, tahun } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "User ID tidak ditemukan" });
    }

    let query = 'SELECT * FROM transaksi WHERE user_id = ?';
    let params = [userId];

    if (bulan && tahun) {
        query += ' AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?';
        params.push(bulan, tahun);
    }

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
});

module.exports = router;
