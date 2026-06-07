import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Heart,
  Brain,
  Info,
  ArrowRight,
  TrendingUp,
  Star,
  Sun,
  Battery,
  BatteryMedium,
  BatteryLow,
  Zap,
  CheckCircle,
  Sparkles,
  Award
} from "lucide-react";
import { ScanResult } from "../types";

interface InsightsScanProps {
  scanResult: ScanResult;
  onUpdateScanResult: (result: ScanResult) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function InsightsScan({
  scanResult,
  onUpdateScanResult,
  onNavigateToTab,
}: InsightsScanProps) {
  // Luyuy 5-Question Daily Energy checkup
  const [q1, setQ1] = useState<number>(scanResult.answers?.q1 || 3);
  const [q2, setQ2] = useState<number>(scanResult.answers?.q2 || 3);
  const [q3, setQ3] = useState<number>(scanResult.answers?.q3 || 3);
  const [q4, setQ4] = useState<number>(scanResult.answers?.q4 || 3);
  const [q5, setQ5] = useState<number>(scanResult.answers?.q5 || 3);

  const [isScanning, setIsScanning] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(!!scanResult.aiRecommendation);
  const [isRecommendationApplied, setIsRecommendationApplied] = useState(!!scanResult.applied);

  // Live Score Calculator
  const totalScore = q1 + q2 + q3 + q4 + q5;
  
  let statusLabel = "🟢 穩定模式";
  let focusTime = 50;
  let energyLevel = 3;
  let stressValue = 35;

  if (totalScore <= 10) {
    statusLabel = "🔴 能量枯竭";
    focusTime = 25;
    energyLevel = 1;
    stressValue = 85;
  } else if (totalScore <= 15) {
    statusLabel = "🟠 恢復模式";
    focusTime = 40;
    energyLevel = 2;
    stressValue = 65;
  } else if (totalScore <= 20) {
    statusLabel = "🟢 穩定模式";
    focusTime = 50;
    energyLevel = 4;
    stressValue = 30;
  } else {
    statusLabel = "🔵 高效模式";
    focusTime = 90;
    energyLevel = 5;
    stressValue = 15;
  }

  // Map energy to background colors
  const gradientStyles = [
    "",
    "linear-gradient(180deg, #FBF9F8 0%, #cac1e8 100%)", // 1: Tired/Purple
    "linear-gradient(180deg, #FBF9F8 0%, #D0E8E1 100%)", // 2: Muted Sage
    "linear-gradient(180deg, #FBF9F8 0%, #e6deff 100%)", // 3: Lavender
    "linear-gradient(180deg, #FBF9F8 0%, #d2e8db 100%)", // 4: Sage Accent
    "linear-gradient(180deg, #FBF9F8 0%, #ffdad6 50%, #d2e8db 100%)", // 5: Vibrant Gold/Sunset Peach
  ];

  // Dynamic advice texts in case Gemini API is offline
  const localRecommendations = [
    "",
    "今日能量偏低。強烈建議在 15:00 安排 20 分鐘午休，暫停繁重的工作決策，優先補充水分並進行溫和的正念伸展。",
    "能量處於平穩修復期。建議於 13:30 進行短暫的閉目養神，並於 15:00 後安排適度的小組日常溝通任務。",
    "能量平衡且健康。明日的最佳專注時段在 10:00，適合整理核心資料、撰寫報告大綱以及安排讀書進度。",
    "精神和專注度很棒！建議把握 14:00 之前的高峰時段，專心處理比較繁重或需要思考的研究與報告，晚間可縮短拉伸休整時長。",
    "能量非常充沛！建議在 11:00 處理比較有挑戰性的新事。注意下午 16:30 稍微進行呼吸調息，放慢腳步避免太晚入睡。"
  ];

  const wakeupTimes = ["", "08:00", "07:45", "07:15", "06:45", "06:15"];
  const peakHours = ["", "15:00 - 16:00", "14:00 - 15:30", "10:00 - 11:30", "09:30 - 11:30", "09:00 - 11:30"];

  const handleStartScan = async () => {
    setIsScanning(true);
    
    // Call server API for live Gemini recommendations if possible, or fallback
    try {
      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          energy: energyLevel, 
          stress: stressValue,
          answers: { q1, q2, q3, q4, q5, totalScore, statusLabel, focusTime }
        }),
      });
      const data = await response.json();
      
      if (data && data.recommendation) {
        onUpdateScanResult({
          energyValue: energyLevel,
          stressIndex: stressValue,
          aiRecommendation: data.recommendation,
          wakeupTime: data.wakeupTime || wakeupTimes[energyLevel],
          peakHourRange: data.peakHour || peakHours[energyLevel],
          applied: false,
          answers: { q1, q2, q3, q4, q5, totalScore, statusLabel, focusTime }
        });
      } else {
        throw new Error("No payload");
      }
    } catch (err) {
      // Fallback
      setTimeout(() => {
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
        const customizedAdvice = `【Luuuy體徵檢測：身體能量得分 ${totalScore} 分 ─ 當前契合 ${statusLabel}】${categoryAdvice}`;

        onUpdateScanResult({
          energyValue: energyLevel,
          stressIndex: stressValue,
          aiRecommendation: customizedAdvice,
          wakeupTime: wakeupTimes[energyLevel],
          peakHourRange: peakHours[energyLevel],
          applied: false,
          answers: { q1, q2, q3, q4, q5, totalScore, statusLabel, focusTime }
        });
      }, 1500);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        setShowRecommendation(true);
      }, 1600);
    }
  };

  const handleApplyPlan = () => {
    setIsRecommendationApplied(true);
    onUpdateScanResult({
      ...scanResult,
      applied: true
    });
    // Directly navigate/jump to timeline tab
    onNavigateToTab("timeline");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-32 transition-all duration-700 font-sans"
      style={{
        background: gradientStyles[energyLevel] || "linear-gradient(180deg, #FBF9F8 0%, #D0E8E1 100%)",
      }}
    >
      {/* AppBar */}
      <header className="w-full sticky top-0 bg-white/40 backdrop-blur-md z-40 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (showRecommendation) {
                setShowRecommendation(false);
                setIsRecommendationApplied(false);
              } else {
                onNavigateToTab("dashboard");
              }
            }}
            className="hover:bg-neutral-200/50 p-2 rounded-full transition-colors cursor-pointer active-scale"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 className="text-xl font-bold font-display text-primary tracking-tight">
            {showRecommendation ? "明日智慧規劃" : "今日身心掃描"}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Brain className="w-5 h-5" />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {!showRecommendation ? (
            <motion.div
              key="scan-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8"
            >
              {/* Encouragement Prompt */}
              <section className="mt-2">
                <h2 className="text-4xl font-extrabold font-display text-primary tracking-tight mb-2 leading-tight">
                  深呼吸...
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed font-sans pr-4">
                  靜下心來感受此刻的內在生理狀態，給予自己最真實、謙遜的回饋。
                </p>
              </section>

              {/* Live Status Tracker Header */}
              <section className="bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant font-sans uppercase tracking-widest">
                    Luuuy 每日能量檢測
                  </h3>
                  <p className="font-extrabold text-base text-primary font-display mt-0.5">
                    當前總分：{totalScore} 分 / 25
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0 bg-[#d2e8db] text-[#384b42] px-3.5 py-1.5 rounded-full font-semibold text-xs border border-[#b4ccc5]">
                  <span>{statusLabel}</span>
                </div>
              </section>

              {/* Q1. 心情 */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-5 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold font-sans bg-primary/10 text-primary px-3 py-1 rounded-full">
                    問題 Q1
                  </span>
                  <span className="text-xs font-bold font-mono text-primary bg-neutral-100 px-2 py-0.5 rounded-md">
                    評分 {q1}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-primary font-sans leading-snug">
                  Q1. 今天的整體心情如何？
                </h4>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {[
                    { score: 1, emoji: "😭", text: "非常糟糕" },
                    { score: 2, emoji: "😞", text: "不太好" },
                    { score: 3, emoji: "😐", text: "普通" },
                    { score: 4, emoji: "🙂", text: "不錯" },
                    { score: 5, emoji: "😆", text: "非常好" },
                  ].map((opt) => (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => setQ1(opt.score)}
                      className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl border text-center transition-all cursor-pointer h-16 ${
                        q1 === opt.score
                          ? "bg-primary text-white border-primary shadow-sm scale-102"
                          : "bg-neutral-50/50 hover:bg-neutral-100/60 border-black/5 text-[#55695f]"
                      }`}
                    >
                      <span className="text-base mb-0.5">{opt.emoji}</span>
                      <span className="text-[8.5px] font-sans font-bold leading-tight line-clamp-1 truncate select-none">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Q2. 疲勞 */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-5 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold font-sans bg-primary/10 text-primary px-3 py-1 rounded-full">
                    問題 Q2
                  </span>
                  <span className="text-xs font-bold font-mono text-primary bg-neutral-100 px-2 py-0.5 rounded-md">
                    評分 {q2}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-primary font-sans leading-snug">
                  Q2. 今天的身體疲勞程度？
                </h4>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {[
                    { score: 1, emoji: "🪫", text: "累到不想動" },
                    { score: 2, emoji: "🥱", text: "很疲勞" },
                    { score: 3, emoji: "😐", text: "普通" },
                    { score: 4, emoji: "🔋", text: "有精神" },
                    { score: 5, emoji: "⚡", text: "精力充沛" },
                  ].map((opt) => (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => setQ2(opt.score)}
                      className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl border text-center transition-all cursor-pointer h-16 ${
                        q2 === opt.score
                          ? "bg-primary text-white border-primary shadow-sm scale-102"
                          : "bg-neutral-50/50 hover:bg-neutral-100/60 border-black/5 text-[#55695f]"
                      }`}
                    >
                      <span className="text-base mb-0.5">{opt.emoji}</span>
                      <span className="text-[8.5px] font-sans font-bold leading-tight line-clamp-1 truncate select-none">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Q3. 壓力 */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-5 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold font-sans bg-primary/10 text-primary px-3 py-1 rounded-full">
                    問題 Q3
                  </span>
                  <span className="text-xs font-bold font-mono text-primary bg-neutral-100 px-2 py-0.5 rounded-md">
                    評分 {q3}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-primary font-sans leading-snug">
                  Q3. 今天的壓力程度？
                </h4>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {[
                    { score: 1, emoji: "🤯", text: "壓力爆表" },
                    { score: 2, emoji: "😰", text: "很有壓力" },
                    { score: 3, emoji: "😐", text: "普通" },
                    { score: 4, emoji: "🧘", text: "壓力不大" },
                    { score: 5, emoji: "🍃", text: "非常輕鬆" },
                  ].map((opt) => (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => setQ3(opt.score)}
                      className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl border text-center transition-all cursor-pointer h-16 ${
                        q3 === opt.score
                          ? "bg-primary text-white border-primary shadow-sm scale-102"
                          : "bg-neutral-50/50 hover:bg-neutral-100/60 border-black/5 text-[#55695f]"
                      }`}
                    >
                      <span className="text-base mb-0.5">{opt.emoji}</span>
                      <span className="text-[8.5px] font-sans font-bold leading-tight line-clamp-1 truncate select-none">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Q4. 成就感 */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-5 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold font-sans bg-primary/10 text-primary px-3 py-1 rounded-full">
                    問題 Q4
                  </span>
                  <span className="text-xs font-bold font-mono text-primary bg-neutral-100 px-2 py-0.5 rounded-md">
                    評分 {q4}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-primary font-sans leading-snug">
                  Q4. 今天完成事情後的成就感？
                </h4>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {[
                    { score: 1, emoji: "🤷", text: "幾乎沒有" },
                    { score: 2, emoji: "📉", text: "很少" },
                    { score: 3, emoji: "😐", text: "普通" },
                    { score: 4, emoji: "📈", text: "不錯" },
                    { score: 5, emoji: "🏆", text: "非常有成就" },
                  ].map((opt) => (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => setQ4(opt.score)}
                      className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl border text-center transition-all cursor-pointer h-16 ${
                        q4 === opt.score
                          ? "bg-primary text-white border-primary shadow-sm scale-102"
                          : "bg-neutral-50/50 hover:bg-neutral-100/60 border-black/5 text-[#55695f]"
                      }`}
                    >
                      <span className="text-base mb-0.5">{opt.emoji}</span>
                      <span className="text-[8.5px] font-sans font-bold leading-tight line-clamp-1 truncate select-none">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Q5. 明日期待 */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-5 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold font-sans bg-primary/10 text-primary px-3 py-1 rounded-full">
                    問題 Q5
                  </span>
                  <span className="text-xs font-bold font-mono text-primary bg-neutral-100 px-2 py-0.5 rounded-md">
                    評分 {q5}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-primary font-sans leading-snug">
                  Q5. 你對明天的期待程度？
                </h4>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {[
                    { score: 1, emoji: "🥀", text: "完全不期待" },
                    { score: 2, emoji: "🤦", text: "有點排斥" },
                    { score: 3, emoji: "😐", text: "普通" },
                    { score: 4, emoji: "🌱", text: "有點期待" },
                    { score: 5, emoji: "✨", text: "很期待" },
                  ].map((opt) => (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => setQ5(opt.score)}
                      className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl border text-center transition-all cursor-pointer h-16 ${
                        q5 === opt.score
                          ? "bg-primary text-white border-primary shadow-sm scale-102"
                          : "bg-neutral-50/50 hover:bg-neutral-100/60 border-black/5 text-[#55695f]"
                      }`}
                    >
                      <span className="text-base mb-0.5">{opt.emoji}</span>
                      <span className="text-[8.5px] font-sans font-bold leading-tight line-clamp-1 truncate select-none">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Tip Card */}
              <section className="bg-[#1a2f2b] text-[#809792] p-5 rounded-3xl flex gap-4 items-start shadow-sm shadow-[#1a2f2b]/15">
                <Brain className="w-6 h-6 text-[#b4ccc5] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-[#ffffff] mb-1">
                    覺察即是轉移
                  </h4>
                  <p className="text-xs leading-normal">
                    接納當下的能量與疲憊是生理自我復原的核心第一步。無論此刻感覺有多沉重，都是完全被允許、且必定是暫時的。
                  </p>
                </div>
              </section>

              {/* Scan Trigger Action Button */}
              <div className="w-full mt-2">
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="w-full h-14 bg-primary text-white rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-neutral-800 transition-all cursor-pointer active-scale"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>正在深度解譯生理軌跡中...</span>
                    </>
                  ) : (
                    <>
                      <span>完成自評，查看 AI 明日智慧建議</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recommendation-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              {/* Daily Achievements badging Card */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60">
                <div className="flex items-center gap-2 mb-3 text-secondary">
                  <Award className="w-4.5 h-4.5 text-primary stroke-[2]" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
                    今日回顧
                  </span>
                </div>
                <h3 className="font-bold font-display text-base text-primary mb-1">
                  今日成就：完成 3 項核心專注任務
                </h3>
                <div className="w-full bg-[#efeeec] h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="bg-primary w-3/4 h-full rounded-full" />
                </div>
                <p className="mt-3 text-xs text-on-surface-variant font-sans leading-relaxed">
                  您今日的深層專注廣度已擊敗 85% 同等體姿之用戶。夜間能量釋放非常平穩。
                </p>
              </section>

              {/* Recommendations Bento display */}
              <section className="glass-card rounded-3xl p-6 flex flex-col items-center text-center overflow-hidden min-h-[300px] justify-center shadow-inner relative">
                {/* Decorative glowing gradient aura nodes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/20 rounded-full blur-[40px] -z-10" />

                {/* Glowing SVG Path Animation */}
                <div className="relative w-full h-32 mb-4 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <defs>
                      <linearGradient id="pathGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.2 }} />
                        <stop offset="50%" style={{ stopColor: "var(--color-primary)", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.2 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 70 Q 50 15, 100 50 T 190 30"
                      fill="none"
                      stroke="url(#pathGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="50" fill="var(--color-primary)" r="4" />
                    <circle cx="100" cy="50" fill="var(--color-primary)" r="8" className="animate-ping" style={{ animationDuration: "3s" }} />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-1 z-10 px-1">
                  <span className="text-[10px] font-bold font-sans text-primary bg-[#d2e8db] px-3.5 py-1 rounded-full inline-block mb-2">
                    明日 AI 專屬智慧剖析
                  </span>
                  <p className="font-bold text-sm leading-relaxed text-primary font-display mb-1 max-w-sm">
                    {scanResult.aiRecommendation || localRecommendations[energyLevel]}
                  </p>
                </div>
              </section>

              {/* Data numbers grid */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 p-4 rounded-2xl border border-black/5 flex flex-col gap-1.5 shadow-sm">
                  <Sun className="w-4.5 h-4.5 text-primary stroke-[2]" />
                  <p className="text-[10px] font-sans font-bold text-on-surface-variant">
                    最佳喚醒時段
                  </p>
                  <p className="font-sans font-bold text-xl text-primary text-left">
                    {scanResult.wakeupTime || wakeupTimes[energyLevel]}
                  </p>
                </div>

                <div className="bg-white/80 p-4 rounded-2xl border border-black/5 flex flex-col gap-1.5 shadow-sm">
                  <Zap className="w-4.5 h-4.5 text-primary stroke-[2]" />
                  <p className="text-[10px] font-sans font-bold text-on-surface-variant">
                    預期高阻專注高峰
                  </p>
                  <p className="font-sans font-bold text-base text-primary text-left pt-0.5">
                    {scanResult.peakHourRange || peakHours[energyLevel]}
                  </p>
                </div>
              </section>

              {/* Dynamic CTA */}
              <div className="w-full mt-4">
                <button
                  onClick={handleApplyPlan}
                  disabled={isRecommendationApplied}
                  className={`w-full h-14 rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    isRecommendationApplied
                      ? "bg-[#d2e8db] text-[#384b42]"
                      : "bg-primary text-[#ffffff] hover:bg-neutral-800"
                  }`}
                >
                  {isRecommendationApplied ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-primary fill-transparent" />
                      <span>明日規劃已無縫加載套用</span>
                    </>
                  ) : (
                    <>
                      <span>接受並智慧套用明日日程</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
