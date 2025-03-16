document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            loginUser(email, password);
        });
    }
});

async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:8090/auth/login', {  // ✅ Correct API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 200 && data.accessToken) {  // ✅ Check for success response & token
            alert(data.message);  // ✅ Show success message from API
            localStorage.setItem('token', data.accessToken); // ✅ Save correct token
            window.location.href = '/dashboard.html'; // ✅ Redirect after login
        } else {
            document.getElementById('loginMessage').innerText = "Login failed. Please check credentials.";
            document.getElementById('loginMessage').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loginMessage').innerText = "Network Error: Unable to login.";
        document.getElementById('loginMessage').style.display = 'block';
        console.error('Login error:', error);
    }
}