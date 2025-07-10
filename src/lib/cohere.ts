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

    const fullPrompt = `You are a helpful AI assistant named Zelearn AI. You're knowledgeable about a wide range of topics and can help with both general questions and specific canvas-related inquiries.

Canvas Context (if relevant): ${canvasDescription}

User: ${prompt}

Instructions:
- If the question is about the canvas or drawing, use the canvas context to provide specific suggestions.
- If it's a general question, provide a helpful and informative response.
- Keep responses friendly and conversational.
- Be concise but thorough.
- If asked about technical topics, provide accurate information.
- If unsure about something, acknowledge it honestly.

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
