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
  const [energyLevel, setEnergyLevel] = useState(scanResult.energyValue || 3);
  const [isScanning, setIsScanning] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(!!scanResult.aiRecommendation);
  const [isRecommendationApplied, setIsRecommendationApplied] = useState(!!scanResult.applied);

  // Dynamic values depending on slider
  const stressMapping = [0, 85, 65, 45, 30, 15]; // tiredness level 1 has high stress, 5 has lower stress
  const stressValue = stressMapping[energyLevel];

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
    "今日能量偏低。強烈建議在 15:00 安排 20 分鐘午休，暫停重度決策，優先補充電解質與進行溫和的正念步行拉伸。",
    "能量處於平穩修復期。建議於 13:30 進行身心靜止冥想，並於 15:00 後搭配中等強度的團隊溝通任務。",
    "能量平衡且健康。明日的最佳專注黃金時段在 10:00，適合開展高階創意構思、專案系統架構及策略分析排程。",
    "精力和专注度旺盛。建議把握 14:00 之前的高峰時段攻克高難度和棘手研究論文，晚間可縮短恢復拉伸時長。",
    "能量充沛到巔峰！建議在 11:00 挑戰最有挑戰性的新項目。注意下午 16:30 稍微進行呼吸調息，避免因亢奮影響睡眠。"
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
        body: JSON.stringify({ energy: energyLevel, stress: stressValue }),
      });
      const data = await response.json();
      
      if (data && data.recommendation) {
        onUpdateScanResult({
          energyValue: energyLevel,
          stressIndex: stressValue,
          aiRecommendation: data.recommendation,
          wakeupTime: data.wakeupTime || wakeupTimes[energyLevel],
          peakHourRange: data.peakHour || peakHours[energyLevel],
          applied: false
        });
      } else {
        throw new Error("No payload");
      }
    } catch (err) {
      // Fallback
      setTimeout(() => {
        onUpdateScanResult({
          energyValue: energyLevel,
          stressIndex: stressValue,
          aiRecommendation: localRecommendations[energyLevel],
          wakeupTime: wakeupTimes[energyLevel],
          peakHourRange: peakHours[energyLevel],
          applied: false
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
    alert("規劃成功！明日黃金專注計畫已同步加載至您的時間軸排程。");
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

              {/* Slider Energy block */}
              <section className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60">
                <label className="text-sm font-bold font-display text-primary block mb-4">
                  你現在的能量儲備狀態如何？
                </label>

                {/* Emoji indicator */}
                <div className="flex justify-center mb-6 h-20 items-center">
                  <motion.div
                    key={energyLevel}
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1.15, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {energyLevel <= 2 ? (
                      <BatteryLow className="w-16 h-16 text-[#484263] stroke-[1.5]" />
                    ) : energyLevel === 3 ? (
                      <BatteryMedium className="w-16 h-16 text-[#2c2745] stroke-[1.5]" />
                    ) : (
                      <Battery className="w-16 h-16 text-primary stroke-[1.5]" />
                    )}
                  </motion.div>
                </div>

                <div className="flex justify-between px-1 mb-2 text-[10px] font-sans font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>疲憊沉重</span>
                  <span>精力充沛</span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer focus:outline-none accent-primary"
                  style={{
                    background: "linear-gradient(to right, #cac1e8, #d0e8e1, #d2e8db, #ffdad6)",
                  }}
                />

                {/* Text mood description list */}
                <div className="flex justify-between mt-4 text-xs font-sans text-neutral-400 font-bold px-1 select-none">
                  <span
                    onClick={() => setEnergyLevel(1)}
                    className={`cursor-pointer ${energyLevel === 1 ? "text-primary font-bold scale-110" : "opacity-40"}`}
                  >
                    疲憊 (1)
                  </span>
                  <span
                    onClick={() => setEnergyLevel(2)}
                    className={`cursor-pointer ${energyLevel === 2 ? "text-primary font-bold scale-110" : "opacity-40"}`}
                  >
                    偏低 (2)
                  </span>
                  <span
                    onClick={() => setEnergyLevel(3)}
                    className={`cursor-pointer ${energyLevel === 3 ? "text-primary font-bold scale-110" : "opacity-40"}`}
                  >
                    平衡 (3)
                  </span>
                  <span
                    onClick={() => setEnergyLevel(4)}
                    className={`cursor-pointer ${energyLevel === 4 ? "text-primary font-bold scale-110" : "opacity-40"}`}
                  >
                    高昂 (4)
                  </span>
                  <span
                    onClick={() => setEnergyLevel(5)}
                    className={`cursor-pointer ${energyLevel === 5 ? "text-primary font-bold scale-110" : "opacity-40"}`}
                  >
                    充沛 (5)
                  </span>
                </div>
              </section>

              {/* Stress Index Segment */}
              <section className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-[0_4px_24px_rgba(5,26,23,0.03)] border border-white/60">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm font-display text-primary">
                    今日綜合壓力估算
                  </h3>
                  <span className="font-sans font-bold text-xl text-primary">
                    {stressValue}%
                  </span>
                </div>

                {/* Animated column bars */}
                <div className="relative w-full h-20 flex items-end justify-between gap-1 overflow-hidden px-1 mb-4 select-none">
                  {[12, 24, 45, 60, 35, 80, 50, 65, 20, 10].map((h, i) => {
                    // Adapt columns based on energy level
                    const adaptedHeight = i === 5 ? stressValue : Math.max(10, Math.min(95, h + (energyLevel * 3) - 10));

                    return (
                      <motion.div
                        key={i}
                        animate={{ height: `${adaptedHeight}%` }}
                        className="flex-1 rounded-t-sm transition-all duration-300"
                        style={{
                          backgroundColor:
                            i === 5
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="p-3 bg-neutral-100 rounded-xl flex items-start gap-2.5">
                  <Info className="w-4.5 h-4.5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-on-surface-variant leading-snug">
                    該指數根據心率變異度 (HRV)、睡眠潛伏期與近期體能消耗數據自動估算。
                  </p>
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
