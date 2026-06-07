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
  const { energy, stress, answers } = req.body;
  
  if (!energy) {
    return res.status(400).json({ error: "Energy value (1-5) is required" });
  }

  // Generate dynamic recommendation backup in case no key or failure
  let backupRecommendation = "";
  if (answers && answers.totalScore !== undefined) {
    const { totalScore, statusLabel } = answers;
    let categoryAdvice = "";
    if (totalScore <= 10) {
      categoryAdvice = "目前能量偏低，不宜安排繁重工作。建議今天提早休息，暫時遠離電子螢幕，讓身體和腦袋好好修補一下。";
    } else if (totalScore <= 15) {
      categoryAdvice = "身心處於調整恢復期。今天安排兩三個核心任務就好，專注在簡報修改或日常紀錄，晚點可以去外面慢走或散步，釋放一點壓力。";
    } else if (totalScore <= 20) {
      categoryAdvice = "狀態非常好！明天可以完成三到五個常規的學習或撰寫，像是整理簡報或完成心得紀錄，每次專心處理約 50 分鐘，效率會很棒哦。";
    } else {
      categoryAdvice = "能量非常棒！今天最適合整理專案的核心架構，或是專注完成比較深度的研究，單次推薦專注 90 分鐘，能一口氣理清許多思緒哦。";
    }
    backupRecommendation = `【Luuuy檢測：${totalScore}分 ─ 契合 ${statusLabel}】${categoryAdvice}`;
  } else if (answers) {
    const { mindState, tensionSource, tomorrowFocus } = answers;
    
    let focusText = "深層專注與重要學習";
    if (tomorrowFocus === "戰略") focusText = "整理核心筆記與進度大綱";
    else if (tomorrowFocus === "溝通") focusText = "團隊小組日常對齊與溫和溝通";
    else if (tomorrowFocus === "修復") focusText = "放鬆休息與身心步伐舒緩";
    else if (tomorrowFocus === "創意") focusText = "自由靈感寫作與設計簡報發想";
 
    let tensionAdvice = "注意規律小憩";
    if (tensionSource === "眼睛") tensionAdvice = "建議減少螢幕亮光，每專注 45 分鐘閉目放鬆一下眼部";
    else if (tensionSource === "頭部") tensionAdvice = "稍微揉按額頭，喝杯水並深呼吸放鬆";
    else if (tensionSource === "身體") tensionAdvice = "可以起來走一走，動一動手腳和肩頸";
    else if (tensionSource === "均衡") tensionAdvice = "維持現在的良好狀態，穩定地推進日程";
 
    let mindText = "平和從容";
    if (mindState === "狂風") mindText = "稍微有些起伏";
    else if (mindState === "微瀾") mindText = "有點匆忙";
 
    backupRecommendation = `感應到您今天心情${mindText}，身體有點${tensionSource === "均衡" ? "放鬆與平衡" : tensionSource + "緊繃"}。明天 10:00 的專注黃金期，為您規劃了「${focusText}」的情境。記得 ${tensionAdvice}，讓學習與好好休整自然地交替。`;
  } else {
    const localRecommendations = [
      "",
      "今日能量偏低。強烈建議在 15:00 安排 20 分鐘午休，暫停繁重的工作決策，優先補充水分並進行溫和的正念伸展。",
      "能量處於平穩修復期。建議於 13:30 進行短暫的閉目養神，並於 15:00 後安排適度的小組日常溝通任務。",
      "能量平衡且健康。明日的最佳專注時段在 10:00，適合整理核心資料、撰寫報告大綱以及安排讀書進度。",
      "精神和專注度很棒！建議把握 14:00 之前的高峰時段，專心處理比較繁重或需要思考的研究與報告，晚間可縮短拉伸休整時長。",
      "能量非常充沛！建議在 11:00 處理比較有挑戰性的新事。注意下午 16:30 稍微進行呼吸調息，放慢腳步避免太晚入睡。"
    ];
    backupRecommendation = localRecommendations[energy] || localRecommendations[3];
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("No API key. Returning standard templated response based on answers.");
    return res.json({ 
      recommendation: backupRecommendation,
      wakeupTime: energy <= 2 ? "07:45" : "07:15",
      peakHour: energy <= 2 ? "14:00 - 15:30" : "10:00 - 11:30"
    });
  }

  try {
    const ai = getGemini();
    let prompt = `你現在是溫柔、陪伴感滿分且專業的身心平衡助理「Luuuy」。你的用戶是一位大專院校學生 / 年輕工作者，剛剛完成了「Luuuy 每日能量檢測」自評問卷：`;

    if (answers && answers.totalScore !== undefined) {
      prompt += `
    - Q1 心情得分：${answers.q1} / 5
    - Q2 疲勞感受：${answers.q2} / 5
    - Q3 壓力指數：${answers.q3} / 5
    - Q4 成就收穫：${answers.q4} / 5
    - Q5 明日期待：${answers.q5} / 5
    - 累計總分：${answers.totalScore}
    - 狀態判定：【${answers.statusLabel}】`;
    } else if (answers) {
      prompt += `
    - 心靈平靜感：${answers.mindState}（浪平、微瀾、狂風）
    - 今日身體張力來源：${answers.tensionSource}（例如眼睛、頭部、身體或均衡）
    - 明日首要專注方向：${answers.tomorrowFocus}（例如整理、對齊、休息、創意）`;
    }

    prompt += `
    
    請你為他/她提供一段溫暖、細膩、自然且實用的「明日安排與身心小撇步」。
    嚴格限制與要求：
    1. 必須使用親切自然、好理解、繁體中文（台灣口吻）回覆，語氣要像一個親切貼心的學長姐或好友，既溫柔專業又不會有任何商務感。
    2. 絕對不可以出現以下任何高階商業、冷冰冰簡報風、或極端強烈詞語：
       - 「攻克」、「極端」、「戰略」、「重構」、「躍遷」、「頂峰」、「顛覆」以及「攻堅」、「直面挑戰」等。
       - 代之以「整理」、「專注核心」、「慢慢恢復」、「調整腳步」、「合適的目標」等自然日常、易讀的說法。
    3. 結合其自評分數和身心狀態判定，給予一小段實用的高峰期專注建議或適當放鬆提醒。
    4. 全句嚴格限制在 80 到 100 字以內，精簡有溫度，絕無贅字。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    const recommendationText = response.text?.trim() || backupRecommendation;

    res.json({
      recommendation: recommendationText,
      wakeupTime: energy <= 2 ? "07:45" : "07:15",
      peakHour: energy <= 2 ? "14:00 - 15:30" : "10:00 - 11:30"
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.json({ 
      recommendation: backupRecommendation,
      wakeupTime: energy <= 2 ? "07:45" : "07:15",
      peakHour: energy <= 2 ? "14:00 - 15:30" : "10:00 - 11:30"
    });
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
