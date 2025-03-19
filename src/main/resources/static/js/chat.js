//OnLoad WebPage
document.addEventListener("DOMContentLoaded", async function () {

    //check logged or not
    const storedProfile = localStorage.getItem('auth_profile');

    // If no email is found, redirect to loginform
    if (!storedProfile) {
        window.location.href = '/BeWelness/static/index.html';
        return;
    }

    //load chat data and call loadChatHistory
    const chatData = localStorage.getItem('counselor_chat');
    if (chatData) {
        //counID ,counName, cusId
        const chatInfo = JSON.parse(chatData);
        document.getElementById('counselorName').textContent = `Chat with Dr.${chatInfo.counName}`;
        await loadChatHistory(chatInfo.cusId,chatInfo.counID);
    }
});

//Load Chat history
async function loadChatHistory(customerId,counselorId) {
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

//Send Message Api
function sendMessage() {
    const input = document.getElementById('message');
    const chatBox = document.getElementById('chatBox');
    const messageText = input.value.trim();

    if (messageText !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'outgoing');
        messageDiv.textContent = messageText;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        input.value = '';
    }
}