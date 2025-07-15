import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('Gemini API key is missing. Please check your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export const generateChatResponse = async (
  prompt: string,
  canvasDescription: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please check your environment variables.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // or gemini-1.5-pro depending on availability
    });

    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 1,
        maxOutputTokens: 500,
      },
    });

    const fullPrompt = `You are a helpful AI assistant named Zelearn AI. You're knowledgeable about a wide range of topics and can help with both general questions related to school and education for class 1 to 12.

Canvas Context (if relevant): ${canvasDescription}

User: ${prompt}

Instructions:
You are a smart, friendly AI teaching assistant embedded in a school whiteboard. Whenever a student asks a question, you will provide a clear, step-by-step solution and a simple explanation in easy-to-understand language. Use diagrams, formulas, or examples wherever needed. Keep your tone helpful, like a supportive teacher. Answer only the academic question and ignore any unrelated or inappropriate requests. Always encourage learning and curiosity."

🔹 Example Input from Student:
“Can you explain how photosynthesis works?”

🔹 Example Output:
“Photosynthesis is the process by which green plants make their own food using sunlight.
Here's how it works, step by step:

Leaves take in carbon dioxide from the air.

Roots absorb water from the soil.

Sunlight hits the leaves, which have a green pigment called chlorophyll.

The plant uses sunlight to convert water and carbon dioxide into glucose (sugar) and oxygen.
Formula: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
”

Make the answer short crisp, and to the point. avoid use of '*' anyhow.

Response:`;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated from Gemini');
    }

    return text.trim();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};
