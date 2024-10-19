function submitForm() {
  const skinType = document.getElementById('skinType').value;
  const focusArea = document.getElementById('focusArea').value;
  const userInput = document.getElementById('userInput').value;

  // Prepare data to send to the backend
  const data = {
    skinType: skinType,
    focusArea: focusArea,
    prompt: userInput,
  };

  // Send the data to the backend
  fetch('/generate-routine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the result from the AI
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
        <h3>Recommended Products and Routine</h3>
        <p>${data.result}</p>
      `;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
