document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('registerForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('registerEmail').value;
        const role = document.getElementById('role').value;

        if (!role) {
            alert("Please select a role.");
            return;
        }

        // Simulated API Call
        alert(`User Registered!\nName: ${firstName} ${lastName}\nEmail: ${email}\nRole: ${role}`);

        // Redirect to login page
        window.location.href = "index.html";
    });
});