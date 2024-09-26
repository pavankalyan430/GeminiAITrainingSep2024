import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
import readline from 'readline';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const responseStream = await model.generateContentStream(userInput);

    // Print text as it comes in.
    process.stdout.write("Gemini: "); // Initial output
    for await (const chunk of responseStream.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }
    console.log("\n"); // Add a newline after the response is complete

    chatLoop();
  });
}

chatLoop();
