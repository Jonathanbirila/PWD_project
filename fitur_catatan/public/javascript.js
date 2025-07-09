document.addEventListener("DOMContentLoaded", function () {
  const btnPengeluaran = document.getElementById("btn-pengeluaran");
  const btnPemasukan = document.getElementById("btn-pemasukan");
  const formPengeluaran = document.getElementById("form-pengeluaran");
  const formPemasukan = document.getElementById("form-pemasukan");

  // Default tampil
  formPengeluaran.style.display = "block";
  formPemasukan.style.display = "none";
  btnPengeluaran.classList.add("active1");
  btnPemasukan.classList.remove("active2");

  // Ganti tampilan form
  btnPengeluaran.addEventListener("click", function (e) {
    e.preventDefault();
    formPengeluaran.style.display = "block";
    formPemasukan.style.display = "none";
    btnPengeluaran.classList.add("active1");
    btnPemasukan.classList.remove("active2");
  });

  btnPemasukan.addEventListener("click", function (e) {
    e.preventDefault();
    formPengeluaran.style.display = "none";
    formPemasukan.style.display = "block";
    btnPengeluaran.classList.remove("active1");
    btnPemasukan.classList.add("active2");
  });

  // Fungsi ambil data dari database
  function tampilkanData () {
    fetch("/data")
      .then((res) => res.json())
      .then((data) => {
        const isiPengeluaran = document.getElementById("isi-tabel-pengeluaran");
        const isiPemasukan = document.getElementById("isi-tabel-pemasukan");

        isiPengeluaran.innerHTML = "";
        isiPemasukan.innerHTML = "";

        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.kategori}</td>
            <td>${item.jumlah}</td>
            <td>${item.keterangan}</td>
          `;
          if (item.tipe === "pengeluaran") {
            isiPengeluaran.appendChild(row);
          } else if (item.tipe === "pemasukan") {
            isiPemasukan.appendChild(row);
          }
        });
      })
      .catch((err) => console.error("Gagal ambil data: ", err));
  }

  tampilkanData();

  // Tangani submit form pengeluaran
  document.getElementById("f-pengeluaran").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch("/submit", {
      method: "POST",
      body: new URLSearchParams(formData)
    })
    .then(res => res.text())
    .then(() => {
      this.reset();
      tampilkanData();
    })
    .catch(err => console.error("Gagal submit pengeluaran:", err));
  });

  // Tangani submit form pemasukan
  document.getElementById("f-pemasukan").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch("/submit", {
      method: "POST",
      body: new URLSearchParams(formData)
    })
    .then(res => res.text())
    .then(() => {
      this.reset();
      tampilkanData();
    })
    .catch(err => console.error("Gagal submit pemasukan:", err));
  });
});
