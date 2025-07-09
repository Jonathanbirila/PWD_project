const fitur1 = document.querySelector('.fitur-1');
const fitur2 = document.querySelector('.fitur-2');
const h2Fitur = document.querySelector('h2');

console.log(fitur1)
console.log(fitur2)

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};


const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

observer.observe(fitur1);
observer.observe(fitur2);
observer.observe(h2Fitur);


function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => {
            if (!res.ok) throw new Error('Gagal login');
            return res.json();
        })
        .then(data => {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            tampilkanStatusLogin();

            // Tampilkan overlay animasi welcome
            document.getElementById('loginUsername').textContent = data.username;
            document.getElementById('loginOverlay').style.display = 'flex';

            // Pindah ke dashboard setelah animasi
            setTimeout(() => {
                window.location.href = 'table/index.html';
            }, 2500);
        })
        .catch(() => {
            alert('Username atau password salah!');
        });
}



function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    showToast("Anda telah logout.");
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

document.addEventListener('DOMContentLoaded', tampilkanStatusLogin);

function tampilkanStatusLogin() {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    const loginForm = document.getElementById('loginForm');
    const welcomeUser = document.getElementById('welcomeUser');
    const dashboardBtn = document.getElementById('dashboardBtn');

    if (userId) {
        loginForm.style.display = 'none';
        welcomeUser.style.display = 'flex';
        dashboardBtn.style.display = 'inline-block';
        document.getElementById('usernameDisplay').textContent = username;
    } else {
        loginForm.style.display = 'flex';
        welcomeUser.style.display = 'none';
        dashboardBtn.style.display = 'none';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // 3 detik hilang otomatis
}

