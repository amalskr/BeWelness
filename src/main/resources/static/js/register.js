document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const roleSelect = document.getElementById("role");
    const counselingTypeContainer = document.getElementById("counselingTypeContainer");
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

    // Show/Hide Counseling Type Dropdown Based on Role
    roleSelect.addEventListener("change", function () {
        if (roleSelect.value === "counselor") {
            counselingTypeContainer.style.display = "block";
            M.FormSelect.init(counselingTypeSelect); // Re-initialize Materialize dropdown
        } else {
            counselingTypeContainer.style.display = "none";
        }
    });

    // Handle Form Submission
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = roleSelect.value;
        const counselingType = counselingTypeSelect.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!role) {
            alert("Please select a role.");
            return;
        }

        if (role === "counselor" && !counselingType) {
            alert("Please select a counseling type.");
            return;
        }

        alert(`User Registered!\nName: ${firstName} ${lastName}\nEmail: ${email}\nRole: ${role}\nCounseling Type: ${counselingType || "N/A"}`);

        window.location.href = "index.html";
    });
});