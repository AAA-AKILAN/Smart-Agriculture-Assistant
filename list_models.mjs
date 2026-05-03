import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBCR45-Fr-m6UjJffhhN2qns3MWD-h6OKw"; // from their .env

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("Available models:", data.models?.map(m => m.name));
}

listModels();
