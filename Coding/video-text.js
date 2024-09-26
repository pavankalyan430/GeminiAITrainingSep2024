import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
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

async function uploadFile(filePath, mimeType, displayName) {
  try {
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: mimeType,
      displayName: displayName,
    });
    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );
    return uploadResponse;
  } catch (error) {
    console.error(`Error uploading ${displayName}:`, error);
    throw error;
  }
}

async function processVideo(filePath, mimeType, displayName) {
  try {
    const uploadResponse = await uploadFile(filePath, mimeType, displayName);
    const name = uploadResponse.file.name;

    // Poll getFile() on a set interval (10 seconds here) to check file state.
    let file = await fileManager.getFile(name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      // Sleep for 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 10000));
      // Fetch the file from the API again
      file = await fileManager.getFile(name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed.");
    }

    // When file.state is ACTIVE, the file is ready to be used for inference.
    console.log(
      `File ${file.displayName} is ready for inference as ${file.uri}`
    );

    return file;
  } catch (error) {
    console.error("Error processing video:", error);
    throw error;
  }
}

// Array of file paths, mimeTypes, and display names
const filesToUpload = [
  {
    path: "GreatRedSpot.mp4",
    mimeType: "video/mp4",
    displayName: "Video 1",
  },
  // Add more files as needed
];

async function generateSummaries() {
  try {
    const processedFiles = await Promise.all(
      filesToUpload.map((file) =>
        processVideo(file.path, file.mimeType, file.displayName)
      )
    );

    // Prepare the content for the model, including all uploaded files
    const content = processedFiles.map((file) => ({
      fileData: {
        mimeType: file.mimeType,
        fileUri: file.uri,
      },
    }));

    // Add your text query related to all uploaded files
    content.push({ text: "Can you summarize these videos?" });

    // Generate content using the uploaded files and text query
    const result = await model.generateContent(content);

    // Output the generated text to the console
    console.log(result.response.text());
  } catch (error) {
    console.error("Error during summary generation:", error);
  }
}

generateSummaries();
