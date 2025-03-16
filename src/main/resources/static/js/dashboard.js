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
    const selectedCounselorInput = document.getElementById('selectedCounselor');
    const bookingModal = document.getElementById('bookingModal');
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('appointmentTime');
    const confirmBooking = document.getElementById('confirmBooking');

    // Initialize Date Picker
    M.Datepicker.init(dateInput, {
        format: "yyyy-mm-dd",
        autoClose: true,
        showClearBtn: true,
        container: document.body // Attach to body to avoid clipping
    });

    // Initialize Time Picker
    M.Timepicker.init(timeInput, {
        twelveHour: false,  // Use 24-hour format
        autoClose: true
    });

    // Initialize Materialize Modal
    M.Modal.init(bookingModal);

    // Populate Counselors List
    counselors.forEach(counselor => {
        let li = document.createElement("li");
        li.className = "collection-item";
        li.innerText = counselor.name;
        li.addEventListener("click", function () {
            selectedCounselorInput.value = counselor.name; // Set counselor name
            M.updateTextFields(); // Refresh Materialize input fields
            M.Modal.getInstance(bookingModal).open(); // Open modal
        });
        counselorsList.appendChild(li);
    });

    // Handle Booking Confirmation
    confirmBooking.addEventListener("click", function () {
        const selectedCounselor = selectedCounselorInput.value;
        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;

        if (!selectedDate || !selectedTime) {
            alert("Please select a valid date and time.");
            return;
        }

        // Simulated booking API call (Replace with actual API)
        alert(`Appointment booked on ${selectedDate} at ${selectedTime}`);


        // Close modal after booking
        M.Modal.getInstance(document.getElementById("bookingModal")).close();
    });

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