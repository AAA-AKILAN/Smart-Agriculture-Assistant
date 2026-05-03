import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBCR45-Fr-m6UjJffhhN2qns3MWD-h6OKw"; // from their .env
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello!");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}
test();
