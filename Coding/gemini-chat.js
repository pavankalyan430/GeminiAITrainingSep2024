import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";
import readline from 'readline';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
  ],
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatLoop() {
  rl.question("You: ", async (userInput) => {
    if (userInput.toLowerCase() === 'goodbye') {
      console.log("Gemini: Goodbye!");
      rl.close();
      return; 
    }

    let result = await chat.sendMessage(userInput);
    console.log("Gemini:", result.response.text());
    chatLoop(); // Continue the loop
  });
}

chatLoop();
