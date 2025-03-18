document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const roleSelect = document.getElementById("role");
    const counselingTypeContainer = document.getElementById("counselingTypeContainer");
    const counselingTypeSelect = document.getElementById("counselingType");

    // Sample Counseling Types
    const counselingTypes = [
        { label: "Mental Health Counseling", value: "MHC" },
        { label: "Marriage and family counseling", value: "MF" },
        { label: "Rehabilitation counseling", value: "RC" },
        { label: "Couples counseling", value: "CC" },
        { label: "Addiction counseling", value: "AC" },
        { label: "Humanistic counseling", value: "HC" },
        { label: "Substance abuse counseling", value: "SAC" }
    ];

    // Populate Counseling Type Dropdown
    counselingTypes.forEach(type => {
        let option = document.createElement("option");
        option.value = type.value;  // Backend enum value
        option.textContent = type.label;  // Display text
        counselingTypeSelect.appendChild(option);
    });

    // Initialize Materialize Dropdown
    M.FormSelect.init(counselingTypeSelect);

    // Show/Hide Counseling Type Dropdown Based on Role
    roleSelect.addEventListener("change", function () {
        if (roleSelect.value === "counsellor") {
            counselingTypeContainer.style.display = "block";
            M.FormSelect.init(counselingTypeSelect);
        } else {
            counselingTypeContainer.style.display = "none";
        }
    });

    // Handle Form Submission (Make It Async)
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const role = roleSelect.value.toUpperCase(); // Convert role to uppercase
        const counselingType = role === "COUNSELLOR" ? counselingTypeSelect.value : "NA"; // Set "NA" for customers

        alert("counselingType "+counselingType +" "+role);

        // Validate Fields
        if (!firstName || !lastName || !email || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (role === "COUNSELLOR" && !counselingType) {
            alert("Please select a counseling type.");
            return;
        }

        // Construct JSON Payload
        const payload = {
            firstName,
            lastName,
            email,
            password,
            role,
            counselingType
        };

        console.log(payload);

        try {
            const response = await fetch("http://localhost:8090/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration Successful! Redirecting to login...");
                window.location.href = "index.html"; // Redirect to login page
            } else {
                alert(`Registration Failed: ${data.message || "Unknown Error"}`);
            }
        } catch (error) {
            alert("Network Error: Unable to register.");
            console.error("Error:", error);
        }
    });
});