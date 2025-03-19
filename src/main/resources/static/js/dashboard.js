document.addEventListener("DOMContentLoaded", function () {
    // Get email from localStorage
    const storedProfile = localStorage.getItem('auth_profile');

    // If no email is found, redirect to login
    if (!storedProfile) {
        window.location.href = '/BeWelness/static/index.html';
        return;
    }

    const profile = JSON.parse(storedProfile);
    let fullName = profile.firstName + " " + profile.lastName;

    // Display user profile name in the dashboard
    document.getElementById('profileName').innerText = fullName;
    document.getElementById('userEmail').innerText = profile.email
    document.getElementById('userRole').innerText = profile.role

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('auth_profile');

        // Prevent back button navigation
        history.pushState(null, null, window.location.href);
        window.history.back();

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

    // Populate counselor list
    const counselorSelect = document.getElementById('counselorSelect');
    const bookingModal = document.getElementById('bookingModal');
    const dateInput = document.getElementById('appointmentDate');
    const timeInput = document.getElementById('appointmentTime');
    const modalCounselorName = document.getElementById('modalCounselorName');


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
        sendMessageApi(modalCounselorName.value, fullName)
    });

    M.Modal.init(bookingModal);

    console.log(profile.role)
    console.log(isCustomer())
    if (isCustomer()) {
        fetchCounselors();
    }

    loadBookings(profile.id)

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


    //check valid time for booking
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

});

// booking update api
async function updateBooking() {
    // Get the necessary values from the modal
    const storedProfile = localStorage.getItem('auth_profile');
    const profile = JSON.parse(storedProfile);
    const requesterId = profile.id

    const bookingId = document.getElementById('editModalBookingId').value
    const counselorId = document.getElementById('editModalCounselorId').value;
    const newStatus = document.getElementById('editModalStatus').value;

    // Construct request payload
    const requestBody = {
        bookingId: parseInt(bookingId),
        requesterId: requesterId,
        counselorId: parseInt(counselorId),
        newStatus: newStatus
    };

    try {
        const response = await fetch('http://localhost:8090/bookings/update', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to update booking');
        }

        alert('Booking updated successfully!');
        const modalInstance = M.Modal.getInstance(document.getElementById('editBookingModal'));
        modalInstance.close();
        await loadBookings(requesterId);

    } catch (error) {
        console.error('Error updating booking:', error);
        alert('Failed to update booking. Please try again.');
    }
}

function updateStatusOptions() {
    const statusSelect = document.getElementById("editModalStatus");
    statusSelect.innerHTML = ""; // Clear existing options

    if (isCustomer()) {
        // Customers can only change to CANCELED
        statusSelect.innerHTML = `
                <option value="CANCELED">CANCELED</option>
            `;
    } else {
        // Counselors can change to any status
        statusSelect.innerHTML = `
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELED">CANCELED</option>
                <option value="DONE">DONE</option>
            `;
    }
}


// open booking edit model with selected item data
function openBookingModal(element) {
    // Corrected the typo in ID
    document.getElementById('editModalBookingId').value = element.getAttribute('data-id');
    document.getElementById('editModalCounselorId').value = element.getAttribute('data-counselor-id');
    document.getElementById('editModalCounselorName').textContent = element.getAttribute('data-counselor-name');
    document.getElementById('editModalCounselorEmail').textContent = element.getAttribute('data-counselor-email');
    document.getElementById('editModalSessionDateTime').textContent = element.getAttribute('data-session-date');
    document.getElementById('editModalStatus').value = element.getAttribute('data-status');

    // Ensure modal is properly initialized
    const modalElement = document.getElementById('editBookingModal');
    const modalInstance = M.Modal.getInstance(modalElement);

    if (!modalInstance) {
        M.Modal.init(modalElement); // Initialize if not already initialized
    }

    updateStatusOptions()
    M.Modal.getInstance(modalElement).open(); // Open the modal
}

// load my bookings
async function loadBookings(customerId) {
    try {
        let apiEndpoint;

        if (isCustomer()) {
            apiEndpoint = `http://localhost:8090/bookings/customer/${customerId}`
        } else {
            apiEndpoint = `http://localhost:8090/bookings/counselor/${customerId}`
        }

        console.log('apiEndpoint', apiEndpoint);

        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const bookings = await response.json();
        const bookingsList = document.getElementById('myBookingsList');
        bookingsList.innerHTML = "";

        bookings.forEach(booking => {
            const listItem = document.createElement('li');
            listItem.classList.add('collection-item');
            listItem.setAttribute('data-id', booking.id);

            if (isCustomer()) {
                listItem.setAttribute('data-counselor-id', booking.conId);
                listItem.setAttribute('data-counselor-name', booking.counselorName);
                listItem.setAttribute('data-counselor-email', booking.counselorEmail);
            } else {
                listItem.setAttribute('data-counselor-id', booking.cusId);
                listItem.setAttribute('data-counselor-name', booking.customerName);
                listItem.setAttribute('data-counselor-email', booking.customerEmail);
            }

            listItem.setAttribute('data-session-date', booking.sessionDateTime);
            listItem.setAttribute('data-status', booking.status);

            console.log(listItem);

            // Map status to class
            let statusClass = "";
            switch (booking.status) {
                case "PENDING":
                    statusClass = "status-pending";
                    break;
                case "CONFIRMED":
                    statusClass = "status-confirmed";
                    break;
                case "CANCELED":
                    statusClass = "status-canceled";
                    break;
                case "DONE":
                    statusClass = "status-done";
                    break;
                default:
                    statusClass = "";
            }

            if (isCustomer()) {
                listItem.innerHTML = `
                        <div class="booking-info">
                            <div>
                                <div class="counselor-name">Dr. ${booking.counselorName}</div>
                                <div class="counselor-email">${booking.counselorEmail}</div>
                            </div>
                            <div class="session-info">
                                <div>${booking.sessionDateTime}</div>
                                <div class="status ${statusClass}">${booking.status}</div>
                            </div>
                        </div>
                    `;
            } else {
                listItem.innerHTML = `
                        <div class="booking-info">
                            <div>
                                <div class="counselor-name">${booking.customerName}</div>
                                <div class="counselor-email">${booking.customerEmail}</div>
                            </div>
                            <div class="session-info">
                                <div>${booking.sessionDateTime}</div>
                                <div class="status ${statusClass}">${booking.status}</div>
                            </div>
                        </div>
                    `;
            }


            // Attach click event to open the modal
            listItem.addEventListener("click", function () {
                openBookingModal(this); // Pass <li> element
            });

            bookingsList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading bookings:", error);
    }
}

// Send Message
async function sendMessageApi(counselorName, fullName) {
    const storedProfile = localStorage.getItem('auth_profile');
    const profile = JSON.parse(storedProfile);
    const msgContent = "Hi, Dr." + counselorName + " I'm " + fullName + ", and " +
        "I need a counseling from you. Can we discuss?"

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
        type: "SENT"
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

                localStorage.setItem('counselor_chat', JSON.stringify({
                    counID: counselorId,
                    counName: counselorName,
                    cusId: userId
                }));

                M.Modal.getInstance(bookingModal).close();

                // Redirect to chat.html after successful message sending
                window.location.href = "/BeWelness/static/chat.html";
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
                    <h6>Dr. ${counselor.firstName} ${counselor.lastName}</h6>
                    <p><strong>${getCounselingTypeLabel(counselor.counselingType)}</strong></p>
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

// Function to get counseling type label by value
function getCounselingTypeLabel(value) {
    const counselingTypes = [
        {label: "Mental Health Counseling", value: "MHC"},
        {label: "Marriage and family counseling", value: "MF"},
        {label: "Rehabilitation counseling", value: "RC"},
        {label: "Couples counseling", value: "CC"},
        {label: "Addiction counseling", value: "AC"},
        {label: "Humanistic counseling", value: "HC"},
        {label: "Substance abuse counseling", value: "SAC"}
    ];

    const type = counselingTypes.find(type => type.value === value);
    return type ? type.label : value; // Return label if found, otherwise return the original value
}

//get saved user profile
function getUserProfile() {
    const storedProfile = localStorage.getItem('auth_profile');
    //CUSTOMER, COUNSELLOR
    return JSON.parse(storedProfile);
}

// Get saved user profile and check if the user is a CUSTOMER
function isCustomer() {
    const prof = getUserProfile(); // Ensure function is called
    return prof && prof.role === "CUSTOMER"; // Check if profile exists and role is CUSTOMER
}