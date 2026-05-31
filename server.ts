import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Falling back to structured templates.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API for smart tailored recommendations
app.post("/api/generate-insights", async (req, res) => {
  const { energy, stress } = req.body;
  
  if (!energy) {
    return res.status(400).json({ error: "Energy value (1-5) is required" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("No API key. Returning standard templated response.");
    return res.json({ recommendation: null });
  }

  try {
    const ai = getGemini();
    const prompt = `你現在是一位專注於身心平衡、Luxury Zen（奢華禪意）哲學的頂級健康生活教練與生理數據分析專家。
    有一位用戶陳先生剛剛完成能量狀態掃描。他的評分如下：
    - 當前能量等級：${energy} 分（範圍：1 疲憊 到 5 精力充沛）
    - 今日綜合壓力指數估計：${stress}%
    
    請你為他提供一段正向、優雅、精煉且溫柔的「明日智慧專案建議」。
    要求：
    1. 用繁體中文回覆，語氣要冷靜、composed、高級且充滿溫柔的陪伴感。
    2. 針對他的能量低或高，提出一項「明日 10:00 專注高峰」的具體工作或放鬆對應安排，且不要講廢話。
    3. 全句控制在 60 到 80 字以內，精準直接。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    const recommendationText = response.text?.trim() || "";

    res.json({
      recommendation: recommendationText,
      wakeupTime: energy <= 2 ? "07:45" : "07:15",
      peakHour: energy <= 2 ? "14:00 - 15:30" : "10:00 - 11:30"
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.json({ recommendation: null });
  }
});

// Setup Vite Dev server or production static serving
async function setupBuildSystem() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Luuuy Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

setupBuildSystem();
