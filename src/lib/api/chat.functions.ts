import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";

export const generateChatResponse = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      history: z.array(
        z.object({
          role: z.enum(["ai", "you"]),
          text: z.string(),
        })
      ),
      message: z.string(),
    })
  )
  .handler(async ({ data }) => {
    let apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback for local development if Vite didn't load the .env file automatically
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
      console.error("CRITICAL ERROR: GEMINI_API_KEY is undefined in process.env");
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const systemPrompt = "You are a gentle, trauma-informed women's wellness guide. You are part of WellNest, an application in Ethiopia for women's wellness. Always respond with empathy and keep answers concise.";
    
    const contents = [];
    
    for (const msg of data.history) {
      contents.push({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }]
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: data.message }]
    });

    if (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
           temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
       console.error("Gemini API Error:", await response.text());
       throw new Error("Failed to generate response");
    }

    const json = await response.json();
    const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at the moment.";

    return { text: aiText };
  });
