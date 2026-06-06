import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";

export const analyzeMealImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      imageBase64: z.string(),
      mimeType: z.string(),
    })
  )
  .handler(async ({ data }) => {
    let apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback for local development
    if (!apiKey) {
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
        if (match) {
          apiKey = match[1].trim();
        }
      } catch (e) {
        // ignore
      }
    }

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const systemPrompt = `Analyze this image. If it is a clear picture of a meal or food, identify the dish and estimate the kcal, protein (g), carbs (g), and fat (g). 
Return strictly a JSON object with this exact schema:
{
  "isMeal": true,
  "name": "Name of Dish",
  "kcal": 500,
  "protein": 20,
  "carbs": 50,
  "fat": 15
}
If the image is blurry, not visible, or is NOT food, return strictly:
{
  "isMeal": false,
  "error": "not_food"
}
Do not return any markdown formatting or code blocks. Just the raw JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: data.mimeType,
                  data: data.imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
           temperature: 0.1,
           responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
       console.error("Gemini API Error:", await response.text());
       throw new Error("Failed to analyze image");
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
        throw new Error("No response from AI");
    }

    try {
        const result = JSON.parse(text);
        return result;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", text);
        throw new Error("Invalid response format");
    }
  });
