import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs'; // Import the fs module


// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const prompt = "Describe what is there in the sketch.";
// Note: The only accepted mime types are some image types, image/*.
const imagePart = fileToGenerativePart('firefighter.jpg',"image/jpeg");

const result = await model.generateContent([prompt, imagePart]);
console.log(result.response.text());