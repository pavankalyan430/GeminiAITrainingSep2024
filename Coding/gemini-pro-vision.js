import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";
dotenv.config();


// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: "gemini-1.5-flash",
});

// Function to upload a single file
async function uploadFile(filePath, mimeType, displayName) {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: mimeType,
    displayName: displayName,
  });
  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );
  return uploadResponse;
}

// Array of file paths, mimeTypes, and display names
const filesToUpload = [
  { path: "Pen.jpg", mimeType: "image/jpeg", displayName: "Image 1" },
  { path: "page-and-pen.jpg", mimeType: "image/jpeg", displayName: "Image 2" }
  // Add more files as needed
];

// Upload each file and store the responses
const uploadResponses = await Promise.all(
  filesToUpload.map(file => uploadFile(file.path, file.mimeType, file.displayName))
);

// Prepare the content for the model, including all uploaded files
const content = uploadResponses.map(response => ({
  fileData: {
    mimeType: response.file.mimeType,
    fileUri: response.file.uri,
  },
}));

// Add your text query related to all uploaded files
content.push({ text: "What is the difference between the two images? Understand what's written on the paper." });

// Generate content using the uploaded files and text query
const result = await model.generateContent(content);

// Output the generated text to the console
console.log(result.response.text());
