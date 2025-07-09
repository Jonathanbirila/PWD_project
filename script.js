//ini buat pilih investasinya mau per bulan atau per tahun 
const tombolTahun = document.getElementById("tahun");
const tombolBulan = document.getElementById("bulan");
tombolTahun.addEventListener("click", function () {
  tombolTahun.classList.add("active");
  tombolBulan.classList.remove("active");
});

tombolBulan.addEventListener("click", function () {
  tombolBulan.classList.add("active");
  tombolTahun.classList.remove("active");
});



// ini buat set angkanya jadi format accounting 
document.querySelectorAll(".format-rupiah").forEach(function(input) {
    input.addEventListener("input", function(e) {
        let value = this.value.replace(/[^0-9]/g, "");
        if (value) {
            let formatted = new Intl.NumberFormat('id-ID').format(value);
            this.value = `${formatted}`;
        } else {
            this.value = "";
        }
    });

    input.addEventListener("blur", function () {
        this.setAttribute("data-value", this.value.replace(/\D/g, ""));
    });
});



//ini buat tampilkan form pertanyaan berikutnya kalo pertanyaan sebelumnya sudah diisi
document.querySelectorAll(".form-step").forEach((step, index, steps) => {
    const input = step.querySelector("input");
    if (input) {
        input.addEventListener("input", () => {
            const cleanValue = input.value.replace(/[^\d]/g, '');
            if (cleanValue.length > 0) {
                const nextStep = steps[index + 1];
                if (nextStep && !nextStep.classList.contains("show")) {
                    nextStep.classList.add("show");
                    nextStep.style.display = "block";
                    nextStep.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    }
});



//ini lanjuttan dari "memunculkan pertanyaan setelah diisi", yang ini khusus toogle tombol bulan/tahun
const toggleButtons = document.querySelectorAll(".toggle-button");
toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
        toggleButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        const nextStep = document.getElementById("step-5");
        if (nextStep && !nextStep.classList.contains("show")) {
            nextStep.classList.add("show");
            nextStep.style.display = "block";
            nextStep.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
});



//ini untuk menyimpan data ke localStorage saat tombol “cek” ditekan
document.querySelector(".submit-btn").addEventListener("click", function () {
    const targetUang = document.getElementById("target-uang").value.replace(/\D/g, '');
    const targetTahun = document.getElementById("target-tahun").value;
    const uangSekarang = document.getElementById("uang-yang-dimiliki").value.replace(/\D/g, '');
    const investasiBulanan = document.getElementById("investasi-per-bulan").value.replace(/\D/g, '');
    const returnTahunan = document.getElementById("return-investasi").value;

    localStorage.setItem("targetUang", targetUang);
    localStorage.setItem("targetTahun", targetTahun);
    localStorage.setItem("uangSekarang", uangSekarang);
    localStorage.setItem("investasiBulanan", investasiBulanan);
    localStorage.setItem("returnTahunan", returnTahunan);

    window.location.href = "hasil.html";
});


