//OnLoad WebPage
document.addEventListener("DOMContentLoaded", async function () {

    //check logged or not
    const storedProfile = localStorage.getItem('auth_profile');

    // If no email is found, redirect to loginform
    if (!storedProfile) {
        window.location.href = '/BeWelness/static/index.html';
        return;
    }

    // Display user profile name in the dashboard
    const profile = JSON.parse(storedProfile);
    let fullName = profile.firstName + " " + profile.lastName;
    document.getElementById('profileName').innerText = fullName;
    document.getElementById('userEmail').innerText = profile.email

    //load chat data and call loadChatHistory
    const chatData = localStorage.getItem('counselor_chat');

    if (!chatData) {
        window.location.href = '/BeWelness/static/dashboard.html';
        return;
    }

    if (chatData) {
        //counID ,counName, cusId
        const chatInfo = JSON.parse(chatData);
        document.getElementById('counselorName').textContent = `Chat with Dr.${chatInfo.counName}`;

        await loadChatHistory(chatInfo.cusId, chatInfo.counID);
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('counselor_chat');
        window.history.back();
    });
});

//Load Chat history
async function loadChatHistory(customerId, counselorId) {
    try {
        const response = await fetch(`http://localhost:8090/message/list?customerId=${customerId}&counselorId=${counselorId}`);
        if (!response.ok) throw new Error("Failed to fetch chat history");

        const messages = await response.json();
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = ""; // Clear previous messages

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.type === 'SENT' ? 'outgoing' : 'incoming');
            messageDiv.textContent = msg.content;
            chatBox.appendChild(messageDiv);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
}

async function sendMessage() {
    const chatData = localStorage.getItem('counselor_chat');
    const chatInfo = JSON.parse(chatData);
    const customerId = chatInfo.cusId
    const counselorId = chatInfo.counID

    const input = document.getElementById('message');
    const messageText = input.value.trim();

    if (messageText !== '') {
        try {
            const response = await fetch('http://localhost:8090/message/send', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({customerId, counselorId, content: messageText, type: "SENT"})
            });

            if (!response.ok) throw new Error("Failed to send message");

            input.value = '';
            await loadChatHistory(customerId, counselorId); // Reload chat history on success
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
}