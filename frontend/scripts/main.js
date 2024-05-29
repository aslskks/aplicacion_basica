// frontend/scripts/main.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const accessForm = document.getElementById('accessForm');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            if (data.user.isSuperUser) {
                window.location.href = '/dashboard.html';
            } else {
                window.location.href = '/secret.html';
            }
        } else {
            alert(data.message);
        }
    });

    accessForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const blockchainKey = document.getElementById('blockchainKey').value;
        const response = await fetch('/access-secret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blockchainKey })
        });
        const data = await response.json();
        alert(data.message);
    });
});
