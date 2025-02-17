// public/js/auth.js

// =========== Registration ===========
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;
    const role = document.getElementById('role').value;

    // Store user info in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.setItem('role', role);

    // Redirect to dashboard
    window.location.href = '/dashboard.html';
  });
}

// =========== Login ===========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    // Retrieve stored credentials
    const storedUser = localStorage.getItem('username');
    const storedPass = localStorage.getItem('password');

    // Simple check
    if (username === storedUser && password === storedPass) {
      // Valid login
      window.location.href = '/dashboard.html';
    } else {
      alert('Invalid credentials!');
    }
  });
}
