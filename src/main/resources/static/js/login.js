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
        const response = await fetch('http://localhost:8090/auth/login', {
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

        if (data.code === 200) {

            document.getElementById('loginMessageErr').style.display = 'none';
            document.getElementById('loginMessageOk').innerText = data.message;
            document.getElementById('loginMessageOk').style.display = 'block';

            //save data
            localStorage.setItem('authEmail', email);
            
            setTimeout(() => {
                window.location.href = '/BeWelness/static/dashboard.html';
            }, 1500);
            
        } else {
            document.getElementById('loginMessageErr').innerText = "Login failed. Please check credentials.";
            document.getElementById('loginMessageErr').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loginMessageErr').innerText = "Login failed. Please check credentials.";
        document.getElementById('loginMessageErr').style.display = 'block';
        console.error('Login error:', error);
    }
}