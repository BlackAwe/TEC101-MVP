function submitForm() {
  const skinType = document.getElementById('skinType').value;
  const focusArea = document.getElementById('focusArea').value;
  const userInput = document.getElementById('userInput').value;

  if (userInput.trim() === '') {
    alert('Please enter a message');
    return;
  }

  // Add user's message to the chat
  addChatBubble(userInput, 'user-message');

  // Clear input
  document.getElementById('userInput').value = '';

  // Show loading spinner
  document.getElementById('loading-spinner').style.display = 'block';

  // Send data to the server
  fetch('/generate-routine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skinType: skinType,
      focusArea: focusArea,
      prompt: userInput,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Hide loading spinner
      document.getElementById('loading-spinner').style.display = 'none';

      // Add the AI's response to the chat (formatted as HTML)
      addChatBubble(data.result, 'groq-response', true); // true for HTML content
    })
    .catch((error) => {
      document.getElementById('loading-spinner').style.display = 'none';
      addChatBubble('Something went wrong. Please try again.', 'groq-response');
    });
}

// Add chat bubbles to the container
function addChatBubble(text, className, isHTML = false) {
  const chatContainer = document.getElementById('chat-container');
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('chat-bubble', className);

  if (isHTML) {
    chatBubble.innerHTML = text; // Set as HTML if true
  } else {
    chatBubble.innerText = text;
  }

  chatContainer.appendChild(chatBubble);

  // Scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
