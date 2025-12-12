import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBlogContent = async (title: string, category: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  try {
    const prompt = `Write a comprehensive, engaging blog post about "${title}" suitable for the "${category}" category. 
    The tone should be professional yet accessible. 
    Include an introduction, a few body paragraphs with subheadings (plain text, no markdown #), and a conclusion. 
    Do not use markdown formatting like bold or italics, just plain text with line breaks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};