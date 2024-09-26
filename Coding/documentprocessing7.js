import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs'; // Import the fs module


// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// To use the File API, add this import path for GoogleAIFileManager.
// Note that this is a different import path than what you use for generating content.
// For versions lower than @google/generative-ai@0.13.0
// use "@google/generative-ai/files"
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

// Upload the file and specify a display name.
const uploadResponse = await fileManager.uploadFile("gemini.pdf", {
  mimeType: "application/pdf",
  displayName: "Gemini 1.5 PDF",
});

// View the response.
console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

// Get the previously uploaded file's metadata.
const getResponse = await fileManager.getFile(uploadResponse.file.name);

// View the response.
console.log(`Retrieved file ${getResponse.displayName} as ${getResponse.uri}`);

// The following was placed here for relevance but should be added to imports.
// To generate content, use this import path for GoogleGenerativeAI.
// Note that this is a different import path than what you use for the File API.
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI with your API_KEY.
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: "gemini-1.5-flash",
});

// Upload file ...

// Generate content using text and the URI reference for the uploaded file.
const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri
      }
    },
    { text: "Can you summarize this document as a bulleted list?" },
  ]);

// Output the generated text to the console
console.log(result.response.text())