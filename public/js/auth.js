// Registration
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    localStorage.setItem('username', username);
    window.location.href = '/dashboard.html';
});

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    localStorage.setItem('username', username);
    window.location.href = '/dashboard.html';
});