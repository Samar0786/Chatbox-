const ws = new WebSocket('ws://localhost:3000');
const messageInput = document.getElementById('messageInput');
const currentUser = localStorage.getItem('username');

// Handle received messages
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    appendMessage(message);
};

// Send messages
document.getElementById('sendButton').addEventListener('click', () => {
    const content = messageInput.value.trim();
    if (content) {
        const message = {
            sender: currentUser,
            content: content,
            timestamp: new Date().toISOString()
        };
        
        // Display immediately
        appendMessage(message);
        
        // Send to server
        ws.send(JSON.stringify(message));
        messageInput.value = '';
    }
});

// Message display
function appendMessage(message) {
    const chatWindow = document.getElementById('chat-messages');
    const isCurrentUser = message.sender === currentUser;
    
    chatWindow.innerHTML += `
        <div class="message ${isCurrentUser ? 'own-message' : ''}">
            <strong>${isCurrentUser ? 'You' : message.sender}:</strong>
            <p>${message.content}</p>
            <small>${new Date(message.timestamp).toLocaleTimeString()}</small>
        </div>
    `;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}