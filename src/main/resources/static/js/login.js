window.sessionStorage.setItem("BASE_URL", "http://localhost:8090")
const BASE_URL = window.sessionStorage.getItem("BASE_URL");

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');


    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            loginUser(email, password);
        });
    }
});

async function loginUser(email, password) {
    try {
        const response = await fetch(BASE_URL + "/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
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
            localStorage.setItem('auth_profile', JSON.stringify(data.profile));
            localStorage.setItem('access_token', data.accessToken);

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

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