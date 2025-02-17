const ws = new WebSocket('ws://localhost:3000');
const messageInput = document.getElementById('messageInput');
const currentUser = localStorage.getItem('username');

// Handle received messages
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    appendMessage(message);
};

// Send text messages
document.getElementById('sendButton').addEventListener('click', () => {
    const content = messageInput.value.trim();
    if (content) {
        const message = {
            sender: currentUser,
            type: 'text',
            content: content,
            timestamp: new Date().toISOString()
        };
        appendMessage(message);
        ws.send(JSON.stringify(message));
        messageInput.value = '';
    }
});

// Send file messages (images and PDFs)
document.getElementById('sendFileButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;

    const base64Data = await toBase64(file);
    let messageType = 'file';
    if (file.type.startsWith('image/')) {
        messageType = 'image';
    } else if (file.type === 'application/pdf') {
        messageType = 'pdf';
    }

    const message = {
        sender: currentUser,
        type: messageType,
        content: base64Data,
        fileName: file.name,
        timestamp: new Date().toISOString()
    };

    appendMessage(message);
    ws.send(JSON.stringify(message));
    fileInput.value = '';
});

// Utility: Convert file to Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Open a new window to display PDF inline
function openPDF(pdfDataUrl) {
    const pdfWindow = window.open("", "_blank");
    pdfWindow.document.write(`
        <html>
            <head>
                <title>PDF Preview</title>
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; }
                    iframe { border: none; width: 100%; height: 100%; }
                </style>
            </head>
            <body>
                <iframe src="${pdfDataUrl}"></iframe>
            </body>
        </html>
    `);
}

// Append message to chat window
function appendMessage(message) {
    const chatWindow = document.getElementById('chat-messages');
    const isCurrentUser = message.sender === currentUser;
    let messageHTML = '';

    if (message.type === 'text') {
        messageHTML = `
            <strong>${isCurrentUser ? 'You' : message.sender}:</strong>
            <p>${message.content}</p>
        `;
    } else if (message.type === 'image') {
        messageHTML = `
            <strong>${isCurrentUser ? 'You' : message.sender}:</strong>
            <p><em>${message.fileName}</em></p>
            <img src="${message.content}" alt="Image" style="max-width: 200px; border: 1px solid #ccc;">
        `;
    } else if (message.type === 'pdf') {
        messageHTML = `
            <strong>${isCurrentUser ? 'You' : message.sender}:</strong>
            <p><em>${message.fileName}</em></p>
            <button onclick="openPDF('${message.content}')">View PDF</button>
        `;
    }

    chatWindow.innerHTML += `
        <div class="message ${isCurrentUser ? 'own-message' : ''}">
            ${messageHTML}
            <small>${new Date(message.timestamp).toLocaleTimeString()}</small>
        </div>
    `;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
