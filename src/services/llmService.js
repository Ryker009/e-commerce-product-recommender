// src/services/llmService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateExplanation = async (userId, recommendedProducts, userStats) => {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("Missing GEMINI_API_KEY");

    // create client
    const genAI = new GoogleGenerativeAI(geminiKey);

    // Use a supported model id (try gemini-2.5-flash)
    // If this still errors, try gemini-2.0-flash or other models from the list endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const productNames = recommendedProducts.map(p => p.name).join(", ");
    const prompt = `
Explain briefly (3 short sentences) why these products were recommended to the user.

Products: ${productNames}

User behavior:
${JSON.stringify(userStats, null, 2)}

Keep the explanation friendly and simple.
`;

    // generate content
    const result = await model.generateContent(prompt);

    // result.response.text() may vary by SDK versions; handle both
    const text = (result?.response?.text && typeof result.response.text === "function")
      ? result.response.text()
      : (result?.response?.text || result?.text || "");

    return text || "These products are recommended based on your browsing and purchase behavior.";

  } catch (err) {
    console.error("GEMINI LLM ERROR:", err?.message || err);
    return "These products are recommended based on your browsing and purchase behavior.";
  }
};
