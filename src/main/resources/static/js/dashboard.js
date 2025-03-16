document.addEventListener("DOMContentLoaded", function () {
    // Get email from localStorage
    const email = localStorage.getItem('authEmail');

    // Display email in the dashboard
    if (email) {
        document.getElementById('userEmail').innerText = email;
    } else {
        document.getElementById('userEmail').innerText = "Guest"; // Fallback text
    }

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('authEmail'); // Remove stored email
        localStorage.removeItem('token'); // Remove token
        window.location.href = '/BeWelness/static/index.html'; // Redirect to login
    });
});