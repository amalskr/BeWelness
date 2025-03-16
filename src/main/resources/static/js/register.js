document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const counselingTypeSelect = document.getElementById("counselingType");

    // Sample Counseling Types
    const counselingTypes = [
        "Mental Health Counseling",
        "Career Counseling",
        "Family Counseling",
        "Substance Abuse Counseling",
        "Grief Counseling"
    ];

    // Populate Counseling Type Dropdown
    counselingTypes.forEach(type => {
        let option = document.createElement("option");
        option.value = type.toLowerCase().replace(/\s+/g, "-");
        option.innerText = type;
        counselingTypeSelect.appendChild(option);
    });

    // Initialize Materialize Dropdown
    M.FormSelect.init(counselingTypeSelect);

    // Handle Form Submission
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;
        const counselingType = counselingTypeSelect.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!role) {
            alert("Please select a role.");
            return;
        }

        if (!counselingType) {
            alert("Please select a counseling type.");
            return;
        }

        alert(`User Registered!\nName: ${firstName} ${lastName}\nEmail: ${email}\nRole: ${role}\nCounseling Type: ${counselingType}`);

        window.location.href = "index.html";
    });
});