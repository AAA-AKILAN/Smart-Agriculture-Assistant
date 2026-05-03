import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAuOjsPqMn4iey-xK9ZryCOfQJOi64vQlg");

(async function() {
  try {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-pro-vision"];
    for (const modelId of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
        await model.generateContent("hello");
        console.log(modelId, "WORKS");
      } catch (err) {
        console.log(modelId, "FAILS -", err.message);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
