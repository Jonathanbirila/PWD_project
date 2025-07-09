let editId = null;
let selectedBulan = new Date().getMonth() + 1;
let selectedTahun = new Date().getFullYear();


function openModal() {
    const modal = document.getElementById('modalForm');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    document.querySelector('#modalForm h3').textContent = "Tambah Transaksi";
    document.querySelector('.btn-submit').textContent = "Tambahkan";
    document.querySelector('.btn-submit').onclick = simpanData;
    clearForm();
}

function tutupModal() {
    const modal = document.getElementById('modalForm');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        clearForm();
    }, 300);
}

function clearForm() {
    document.getElementById('tanggal').value = '';
    document.getElementById('kategori').value = '';
    document.getElementById('jumlah').value = '';
    document.getElementById('keterangan').value = '';
    editId = null;
}

function simpanData() {
    const tanggal = document.getElementById('tanggal').value;
    const kategori = document.getElementById('kategori').value;
    const jumlah = document.getElementById('jumlah').value;
    const keterangan = document.getElementById('keterangan').value;
    const userId = localStorage.getItem('userId');

    if (!tanggal || !kategori || !jumlah || !keterangan) {
        alert("Harap lengkapi semua field!");
        return;
    }

    const data = {
        tanggal,
        kategori,
        jumlah: parseInt(jumlah),
        keterangan,
        userId: parseInt(userId)
    };

    if (editId !== null) {
        fetch(`http://localhost:3000/api/keuangan/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => {
                loadData();
                tutupModal();
            })
            .catch(err => {
                console.error('Gagal mengupdate:', err);
                alert("Gagal mengupdate data.");
            });
    } else {
        fetch('http://localhost:3000/api/keuangan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => {
                loadData();
                tutupModal();
            })
            .catch(err => {
                console.error('Gagal menyimpan:', err);
                alert("Gagal menyimpan data.");
            });
    }
}

function openEditModal(id, tanggal, keterangan, kategori, jumlah) {
    const modal = document.getElementById('modalForm');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);

    document.querySelector('#modalForm h3').textContent = "Edit Transaksi";
    document.querySelector('.btn-submit').textContent = "Update";
    document.getElementById('tanggal').value = tanggal;
    document.getElementById('kategori').value = kategori;
    document.getElementById('jumlah').value = jumlah;
    document.getElementById('keterangan').value = keterangan;
    editId = id;

    document.querySelector('.btn-submit').onclick = simpanData;
}

function hapusData(btn, id) {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:3000/api/keuangan/${id}?userId=${userId}`, {
        method: 'DELETE'
    })
        .then(() => {
            btn.parentElement.parentElement.remove();
            loadData(); // update tampilan saldo
        })
        .catch(err => {
            console.error('Gagal menghapus:', err);
        });
}


function formatTanggal(tgl) {
    const date = new Date(tgl);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function unduhPDF() {
    const userId = localStorage.getItem('userId');
    console.log("User ID:", userId); // ➤ Debug userId

    if (!userId) {
        alert('User belum login!');
        return;
    }

    fetch(`http://localhost:3000/api/keuangan?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
            console.log("DATA DARI API UNTUK PDF:", data); // ➤ Debug hasil fetch

            if (data.length === 0) {
                alert("Tidak ada data untuk diekspor.");
                return;
            }

            let totalPemasukan = 0;
            let totalPengeluaran = 0;
            let rowsHTML = '';
            let no = 1;

            data.forEach(item => {
                const tanggal = formatTanggal(item.tanggal);
                const keterangan = item.keterangan;
                const kategori = item.kategori;
                const jumlah = item.jumlah;

                let pemasukan = '', pengeluaran = '';
                if (kategori === 'Pemasukan') {
                    pemasukan = 'Rp' + jumlah.toLocaleString("id-ID");
                    totalPemasukan += jumlah;
                } else {
                    pengeluaran = 'Rp' + jumlah.toLocaleString("id-ID");
                    totalPengeluaran += jumlah;
                }

                rowsHTML += `
                    <tr>
                        <td>${no++}</td>
                        <td>${tanggal}</td>
                        <td>${keterangan}</td>
                        <td>${pengeluaran}</td>
                        <td>${pemasukan}</td>
                        <td>${kategori}</td>
                    </tr>`;
            });

            const saldo = totalPemasukan - totalPengeluaran;

            const today = new Date();
            const tglAwal = `01/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
            const tglAkhir = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const tglAkhirFormatted = `${String(tglAkhir.getDate()).padStart(2, '0')}/${String(tglAkhir.getMonth() + 1).padStart(2, '0')}/${tglAkhir.getFullYear()}`;

            const htmlContent = `
                <div style="font-family: Arial; padding: 10px; color: #000;">
                    <h2 style="text-align: center;">Laporan Keuangan</h2>
                    <table style="margin-bottom: 20px;">
                        <tr><td><strong>Tanggal</strong></td><td>: ${tglAwal} - ${tglAkhirFormatted}</td></tr>
                        <tr><td><strong>Pemasukan</strong></td><td>: Rp${totalPemasukan.toLocaleString('id-ID')}</td></tr>
                        <tr><td><strong>Pengeluaran</strong></td><td>: Rp${totalPengeluaran.toLocaleString('id-ID')}</td></tr>
                        <tr><td><strong>Saldo</strong></td><td>: Rp${saldo.toLocaleString('id-ID')}</td></tr>
                    </table>

                    <table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse: collapse; color: #000;">
                        <thead style="background-color: #eee; color: #000;">

                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Keterangan</th>
                                <th>Pengeluaran</th>
                                <th>Pemasukan</th>
                                <th>Kategori</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHTML}</tbody>
                    </table>

                </div>`;

            const printArea = document.createElement('div');
            printArea.innerHTML = htmlContent;
            printArea.style.display = 'block';
            document.body.appendChild(printArea);

            setTimeout(() => {
                html2pdf().set({
                    margin: 0.5,
                    filename: `Laporan-Keuangan-${today.getFullYear()}-${today.getMonth() + 1}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                }).from(printArea).save().then(() => {
                    printArea.remove();
                });
            }, 100); // delay 100ms cukup
        })
        .catch(err => {
            console.error('Gagal mengambil data:', err);
            alert('Terjadi kesalahan saat mengambil data.');
        });
}


function loadData() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User belum login!');
        return;
    }

    const url = `http://localhost:3000/api/keuangan?userId=${userId}&bulan=${selectedBulan}&tahun=${selectedTahun}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('data-body');
            tbody.innerHTML = ''; // clear data lama

            let totalPemasukan = 0;
            let totalPengeluaran = 0;

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatTanggal(item.tanggal)}</td>
                    <td>${item.keterangan}</td>
                    <td>${item.kategori}</td>
                    <td>Rp. ${item.jumlah.toLocaleString("id-ID")}</td>
                    <td>
                        <button class="btn-edit" onclick="openEditModal(${item.id}, '${item.tanggal}', '${item.keterangan}', '${item.kategori}', ${item.jumlah})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-hapus" onclick="hapusData(this, ${item.id})">
                            <i class="fas fa-trash-alt"></i> Hapus
                        </button>
                    </td>
                `;
                tbody.appendChild(row);

                if (item.kategori === "Pemasukan") {
                    totalPemasukan += item.jumlah;
                } else if (item.kategori === "Pengeluaran") {
                    totalPengeluaran += item.jumlah;
                }
            });

            const saldo = totalPemasukan - totalPengeluaran;
            document.getElementById("total-pemasukan").textContent = totalPemasukan.toLocaleString("id-ID");
            document.getElementById("total-pengeluaran").textContent = totalPengeluaran.toLocaleString("id-ID");
            document.getElementById("total-saldo").textContent = saldo.toLocaleString("id-ID");
        })
        .catch(err => {
            console.error('Gagal mengambil data:', err);
        });
}



// Tampilkan username
document.getElementById('userDisplay').textContent = localStorage.getItem('username') || 'Pengguna';

// Logout dengan animasi
function logout() {
    const username = localStorage.getItem('username') || 'Pengguna';
    const goodbyeOverlay = document.getElementById('goodbyeOverlay');
    const goodbyeName = document.getElementById('goodbyeName');

    goodbyeName.textContent = username;
    goodbyeOverlay.style.display = 'flex';

    setTimeout(() => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.href = '../login.html';
    }, 2500);
}

// Saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Pengguna';
    document.getElementById('welcomeName').textContent = username;

    setTimeout(() => {
        const welcome = document.getElementById('welcomeOverlay');
        if (welcome) {
            welcome.remove();
        }
    }, 2500);

    loadData();
});

const namaBulan = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
];

function tampilkanBulanAktif() {
    const now = new Date();
    const bulan = now.getMonth(); // 0-11
    const tahun = now.getFullYear();
    document.getElementById('currentMonthYear').textContent = `${namaBulan[bulan]} ${tahun}`;
}

function isiDropdownFilter() {
    const select = document.getElementById('filterMonth');
    const tahun = new Date().getFullYear();

    namaBulan.forEach((bulan, index) => {
        const option = document.createElement('option');
        option.value = index + 1; // ini penting! nilai 1-12
        option.textContent = `${bulan} ${tahun}`;

        // tandai bulan sekarang sebagai selected
        if (index === new Date().getMonth()) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    // set default bulan & tahun
    selectedBulan = new Date().getMonth() + 1;
    selectedTahun = tahun;

    // langsung tampilkan label dan load data
    tampilkanBulanAktif();
    loadData();
}





function ubahBulan() {
    const select = document.getElementById('filterMonth');
    selectedBulan = parseInt(select.value); // ambil nilai 1-12
    selectedTahun = new Date().getFullYear();

    // update teks label di atas
    document.getElementById('currentMonthYear').textContent = `${namaBulan[selectedBulan - 1]} ${selectedTahun}`;

    loadData(); // tampilkan data sesuai bulan
}




window.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Pengguna';
    document.getElementById('welcomeName').textContent = username;

    setTimeout(() => {
        const welcome = document.getElementById('welcomeOverlay');
        if (welcome) {
            welcome.remove();
        }
    }, 2500);

    isiDropdownFilter(); // ⬅️ cukup panggil ini saja, tidak perlu loadData() lagi di sini
});