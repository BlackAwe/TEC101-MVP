import express from 'express';
import bodyParser from 'body-parser';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Initialize Groq client with API key from environment variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Use the API key from the environment variable
});

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Route to handle form submission for AI routine generation
app.post('/generate-routine', async (req, res) => {
  const { skinType, focusArea, prompt } = req.body;

  // Combine parameters to form a single input for the AI API
  const aiPrompt = `My skin type is ${skinType}, and I'm focusing on my ${focusArea}. ${prompt}`;

  try {
    // Call the Groq SDK to generate a chat completion
    const chatCompletion = await getGroqChatCompletion(aiPrompt);

    // Format the response to resemble a chat message
    const formattedResponse = formatChatResponse(chatCompletion);

    // Send the AI-generated response back to the frontend
    res.json({ result: formattedResponse });
  } catch (error) {
    console.error('Error with Groq AI:', error);
    res.status(500).json({ error: 'Error generating routine' });
  }
});

// Function to get chat completion using Groq API
async function getGroqChatCompletion(userPrompt) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama3-8b-8192', // Example model
    });

    // Return the response content
    return response.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('Error fetching completion from Groq AI:', error);
    throw new Error('Groq AI request failed');
  }
}

// Function to format the Groq response for chat-like UI
function formatChatResponse(response) {
  // Split long paragraphs into separate lines for easier reading
  const formatted = response
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .join('<br>');
  return formatted;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
