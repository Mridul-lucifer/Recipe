// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME });

// Helper to generate a prompt for dish suggestions
const generateSuggestionsPrompt = (ingredients, flavor, preferences) => {
  return `Act as a professional chef. Based on these ingredients: ${ingredients}. 
  The user wants a ${flavor} flavor profile. Additional preferences: ${preferences}.
  Suggest 3 unique dishes. Return ONLY a JSON array of objects with keys: "id", "title", and "description".`;
};

// 1. Endpoint to get dish suggestions
app.post('/api/suggestions', async (req, res) => {
  try {
    const { ingredients, flavor, preferences } = req.body;
    const prompt = generateSuggestionsPrompt(ingredients, flavor, preferences);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, ""); // Clean Markdown
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// 2. Endpoint to get the full detailed recipe
app.post('/api/recipe', async (req, res) => {
  try {
    const { dishTitle } = req.body;
    const prompt = `Provide a user-friendly, step-by-step recipe for ${dishTitle}. 
    Include: Prep time, Cook time, Ingredients list, and numbered Instructions. 
    Format it cleanly for a mobile UI.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ recipe: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
