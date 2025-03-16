document.addEventListener("DOMContentLoaded", function () {
    // Get email from localStorage
    const email = localStorage.getItem('authEmail');

    // If no email is found, redirect to login
    if (!email) {
        window.location.href = '/BeWelness/static/index.html';
        return;
    }

    // Display email in the dashboard
    document.getElementById('userEmail').innerText = email;

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('authEmail'); // Remove stored email
        localStorage.removeItem('token'); // Remove token

        // Prevent back button navigation
        history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            history.go(1);
        };

        // Redirect to login page
        window.location.href = '/BeWelness/static/index.html';
    });

    // Prevent back navigation if logged out
    window.onpopstate = function () {
        if (!localStorage.getItem('authEmail')) {
            window.location.href = '/BeWelness/static/index.html';
        }
    };
});