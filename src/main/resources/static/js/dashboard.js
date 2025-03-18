document.addEventListener("DOMContentLoaded", function () {
    // Get email from localStorage
    const storedProfile = localStorage.getItem('auth_profile');

    // If no email is found, redirect to login
    if (!storedProfile) {
        window.location.href = '/BeWelness/static/index.html';
        return;
    }

    const profile = JSON.parse(storedProfile);


    // Display user profile name in the dashboard
    document.getElementById('profileName').innerText = profile.firstName + " " + profile.lastName;
    document.getElementById('userEmail').innerText = profile.email

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('auth_profile');

        // Prevent back button navigation
        history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            history.go(1);
        };

        // Redirect to login page
        window.location.href = '/BeWelness/static/index.html';
    });


    // Prevent back navigation
    window.onpopstate = function () {
        if (!localStorage.getItem('auth_profile')) {
            window.location.href = '/BeWelness/static/index.html';
        }
    };



    //UI ACTION

    const myBookings = [
        { id: 1, counselor: "Dr. John Doe", date: "2025-03-20", time: "10:00 AM" },
        { id: 2, counselor: "Dr. Alice Brown", date: "2025-03-22", time: "2:00 PM" },
        { id: 3, counselor: "Dr. Jane Smith", date: "2025-03-25", time: "11:30 AM" },
        { id: 4, counselor: "Dr. John Doe", date: "2025-03-27", time: "3:00 PM" },
        { id: 5, counselor: "Dr. Alice Brown", date: "2025-03-29", time: "9:15 AM" },
        { id: 6, counselor: "Dr. John Doe", date: "2025-04-01", time: "1:00 PM" },
        { id: 7, counselor: "Dr. Jane Smith", date: "2025-04-03", time: "10:45 AM" },
        { id: 8, counselor: "Dr. Alice Brown", date: "2025-04-05", time: "4:00 PM" }
    ];


    // Populate counselor list
    const myBookingsList = document.getElementById('myBookingsList');
    const counselorsList = document.getElementById('counselorList');
    const counselorSelect = document.getElementById('counselorSelect');
    const bookingModal = document.getElementById('bookingModal');
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('appointmentTime');
    const confirmBooking = document.getElementById('confirmBooking');


    // Handle Booking Confirmation
    document.getElementById('bookingNow').addEventListener('click', function () {
        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;

        if (!selectedDate || !selectedTime) {
            alert("Please select a valid date and time.");
            return;
        }

        confirmBookingApi(selectedDate, selectedTime)
    });

    //Start chat with counselor
    document.getElementById('chatWithCounselor').addEventListener('click', function () {
       sendMessageApi("Hi, Dr")
    });

    M.Modal.init(bookingModal);
    fetchCounselors();

    // Calculate today's date and max selectable date (1 month from today)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1); // Set max date 1 month ahead


    // Initialize Date Picker
    M.Datepicker.init(dateInput, {
        format: "yyyy-mm-dd",
        autoClose: true,
        showClearBtn: true,
        container: document.body,
        minDate: today,  // Disable today and past dates
        maxDate: maxDate // Allow selection up to 1 month from today
    });

    // Initialize Time Picker
    M.Timepicker.init(timeInput, {
        twelveHour: false,  // Use 24-hour format
        autoClose: true,
        onCloseEnd: function () {
            validateTimeSelection();
        }
    });


    function validateTimeSelection() {
        const selectedTime = timeInput.value;
        if (selectedTime) {
            const [hour, minute] = selectedTime.split(":").map(Number);
            if (hour < 9 || (hour === 16 && minute > 0) || hour > 16) {
                alert("Please select a time between 9:00 AM and 4:00 PM.");
                timeInput.value = "";
            }
        }
    }

    // Initialize Materialize Modal
    //M.Modal.init(bookingModal);

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


    // Populate My Bookings Section
    myBookings.forEach(booking => {
        let li = document.createElement("li");
        li.className = "collection-item";
        li.innerHTML = `<strong>${booking.counselor}</strong> <br> ${booking.date} at ${booking.time}`;
        myBookingsList.appendChild(li);
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


    const chatButton = document.getElementById('chatWithCounselor');

    // Chat button click event
    chatButton.addEventListener("click", function () {
        const counselorName = selectedCounselorInput.value;
        if (counselorName) {
            let confirmChat = confirm(`Do you want to start a chat with ${counselorName}?`);
            if (confirmChat) {
                alert(`Chat started with ${counselorName}!`);
                // Future: Redirect to chat screen or open chat modal
            }
        } else {
            alert("Please select a counselor first!");
        }
    });

});

// Send Message
async function sendMessageApi(msgContent) {
    const storedProfile = localStorage.getItem('auth_profile');
    const profile = JSON.parse(storedProfile);

    const userId = profile.id
    const counselorId = document.getElementById('modalCounselorId').value;

    if (!msgContent) {
        alert("Please enter message");
        return;
    }

    const sendMsgData = {
        customerId: userId,
        counselorId: counselorId,
        content: msgContent,
        type:"SENT"
    };

    try {
        const response = await fetch('http://localhost:8090/message/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendMsgData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);

            if (result.message.includes("successfully")) {
                M.Modal.getInstance(bookingModal).close();
            }
        } else {
            alert(`Send Message failed: ${result.message}`);
        }

    } catch (error) {
        console.error("Send Message error:", error);
        alert("An error occurred while Send Message. Please try again.");
    }
}

//Create Booking API
async function confirmBookingApi(selectedDate, selectedTime) {
    const storedProfile = localStorage.getItem('auth_profile');
    const profile = JSON.parse(storedProfile);

    const userId = profile.id
    const counselorId = document.getElementById('modalCounselorId').value;

    if (!selectedDate || !selectedTime) {
        alert("Please select a valid date and time for the appointment.");
        return;
    }

    // Construct sessionDateTime in "YYYY-MM-DD HH:MM" format
    const sessionDateTime = `${selectedDate} ${selectedTime}:00`;

    const bookingData = {
        userId: userId,
        counselorId: counselorId,
        sessionDateTime: sessionDateTime
    };

    try {
        const response = await fetch('http://localhost:8090/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);

            if (result.message.includes("Success")) {
                M.Modal.getInstance(bookingModal).close();
            }
        } else {
            alert(`Booking failed: ${result.message}`);
        }

    } catch (error) {
        console.error("Booking error:", error);
        alert("An error occurred while booking. Please try again.");
    }
}


//load all Counselors when load the webpage
async function fetchCounselors() {
    try {
        const response = await fetch('http://localhost:8090/user/counselors');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const counselors = await response.json();
        const counselorList = document.getElementById('counselorList');

        counselors.forEach(counselor => {
            // Create a card div for each counselor
            const counselorCard = document.createElement('div');
            counselorCard.classList.add('counselor-card');

            // Set the counselor information
            counselorCard.innerHTML = `
                <div class="counselor-content">
                    <h6>${counselor.firstName} ${counselor.lastName}</h6>
                    <p><strong>${counselor.counselingType}</strong></p>
                    <p>${counselor.email}</p>
                    <hr/>
                </div>
            `;

            // Click event to open the modal and set details
            counselorCard.addEventListener('click', function () {
                document.getElementById('modalCounselorName').value = `${counselor.firstName} ${counselor.lastName}`;
                document.getElementById('modalCounselorId').value = counselor.counselorId;

                // Open the Materialize Modal
                M.Modal.getInstance(bookingModal).open();
            });

            // Append to list
            counselorList.appendChild(counselorCard);
        });
    } catch (error) {
        console.error("Error fetching counselors:", error);
    }
}