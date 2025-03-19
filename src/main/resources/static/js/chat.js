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