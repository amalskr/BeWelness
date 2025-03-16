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

    // Mock list of counselors
    const counselors = [
        { id: 1, name: "Dr. John Doe" },
        { id: 2, name: "Dr. Jane Smith" },
        { id: 3, name: "Dr. Alice Brown" }
    ];

    // Populate counselor list
    const counselorsList = document.getElementById('counselorsList');
    const counselorSelect = document.getElementById('counselorSelect');

    counselors.forEach(counselor => {
        // Add to left panel
        let li = document.createElement("li");
        li.className = "collection-item";
        li.innerText = counselor.name;
        counselorsList.appendChild(li);

        // Add to dropdown
        let option = document.createElement("option");
        option.value = counselor.id;
        option.innerText = counselor.name;
        counselorSelect.appendChild(option);
    });

    // Initialize Materialize dropdown
    M.FormSelect.init(counselorSelect);

    // Chat functionality
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    sendMessageBtn.addEventListener("click", function () {
        const selectedCounselor = counselorSelect.value;
        const messageText = messageInput.value.trim();

        if (!selectedCounselor) {
            alert("Please select a counselor!");
            return;
        }

        if (messageText) {
            const messageElement = document.createElement("p");
            messageElement.innerHTML = `<strong>You:</strong> ${messageText}`;
            chatMessages.appendChild(messageElement);

            // Simulated response
            setTimeout(() => {
                const replyElement = document.createElement("p");
                replyElement.innerHTML = `<strong>Dr. ${selectedCounselor}:</strong> Thank you for reaching out.`;
                chatMessages.appendChild(replyElement);
            }, 1000);

            messageInput.value = ""; // Clear input
        }
    });

    // Prevent back navigation
    window.onpopstate = function () {
        if (!localStorage.getItem('authEmail')) {
            window.location.href = '/BeWelness/static/index.html';
        }
    };
});