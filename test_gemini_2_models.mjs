import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBCR45-Fr-m6UjJffhhN2qns3MWD-h6OKw"; // from their .env
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
  for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("test");
        console.log(`Success with model ${m}:`, result.response.text());
        return;
      } catch (error) {
        console.error(`Error with model ${m}:`, error.message);
      }
  }
}
test();
