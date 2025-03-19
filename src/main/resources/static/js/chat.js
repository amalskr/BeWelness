document.addEventListener("DOMContentLoaded", function() {
    const chatData = localStorage.getItem('counselor_chat');
    if (chatData) {
        //counID ,counName, cusId
        const chatInfo = JSON.parse(chatData);
        document.getElementById('counselorName').textContent = `Chat with Dr.${chatInfo.counName}`;
    }
});

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