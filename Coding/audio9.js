import dotenv from "dotenv";
dotenv.config();
// import { GoogleGenerativeAI } from "@google/generative-ai";
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// To use the File API, add the following import path for GoogleAIFileManager.
// Note that this is a different import path than used for generating content.
// For versions lower than @google/generative-ai@0.13.0
// use "@google/generative-ai/files"
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Upload the file.
const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const audioFile = await fileManager.uploadFile("sample.mp3", {
  mimeType: "audio/mp3",
});

// To generate content, use this import path for GoogleGenerativeAI.
// Note that this is a different import path than what you use for the File API.
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Initialize a Gemini model appropriate for your use case.
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Generate content using a prompt and the metadata of the uploaded file.
const result = await model.generateContent([
    {
      fileData: {
        mimeType: audioFile.file.mimeType,
        fileUri: audioFile.file.uri
      }
    },
    { text: "Summarize the speech." },
  ]);

// Print the response.
console.log(result.response.text())

