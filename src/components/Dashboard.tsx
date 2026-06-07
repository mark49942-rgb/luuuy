import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  Zap,
  Calendar,
  Archive,
  LineChart,
  ChevronRight,
  Target,
  Image as ImageIcon,
  Check,
  Sparkles,
  Award,
  BookOpen,
  X
} from "lucide-react";
import { Task, ScanResult } from "../types";

interface DashboardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
  scanResult?: ScanResult;
}

export default function Dashboard({ tasks, onToggleTask, onNavigateToTab, scanResult }: DashboardProps) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const score = scanResult?.answers?.totalScore;
  const energyPercent = score ? Math.round((score / 25) * 100) : 82;
  const modeLabel = scanResult?.answers?.statusLabel || "🟢 穩定模式";
  
  let greetingDesc = "根據晨間掃描，您的能量儲備正處於良好狀態。";
  if (score !== undefined) {
    if (score <= 10) greetingDesc = "感應到您的能量嚴重枯竭，今日請盡量低能耗運轉，開啟主動放空與睡眠修護。";
    else if (score <= 15) greetingDesc = "您的身體處於需要休養恢復的階段，請配合適度運動並避免過度排滿任務。";
    else if (score <= 20) greetingDesc = "您的狀態良好、神采奕奕，適合按部就班高效拓展常規創意與學習工作。";
    else greetingDesc = "您的能量非常充沛、狀態很好，適合處理比較需要思考的專案或核心任務！";
  }

  // Filter tasks to show top 3
  const activeTasks = tasks.slice(0, 3);
  const remainingCount = tasks.filter((t) => !t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pb-32 px-6 pt-4"
    >
      {/* Top Header AppBar */}
      <header className="w-full flex justify-between items-center py-4 mb-4">
        <h1 className="text-2xl font-bold font-display tracking-tight text-primary">
          Luuuy
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => alert("功能展示：搜尋生物特徵記錄與專注任務")}
            className="p-2 hover:bg-neutral-200/50 transition-colors rounded-full text-on-surface-variant cursor-pointer active-scale"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>
          <button
            onClick={() => alert("系統提示：您的當前專注週期將於 11:30 結束，隨後進入正念步行修復時段。")}
            className="p-2 hover:bg-neutral-200/50 transition-colors rounded-full text-on-surface-variant cursor-pointer active-scale relative"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </header>

      {/* Greetings Subtitle */}
      <section className="flex flex-col gap-1 mb-8">
        <h2 className="text-3xl font-extrabold font-display text-primary leading-tight tracking-tight">
          早安，陳先生
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed pr-2">
          {greetingDesc}
        </p>
      </section>

      {/* Energy Bento grid section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Left Big Hero Energy Dial */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(5,26,23,0.04)] hover:shadow-[0_8px_30px_rgba(5,26,23,0.06)] transition-all flex flex-col items-center justify-center relative overflow-hidden h-[340px]">
          {/* Subtle Ambient Light glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/30 blur-[60px] rounded-full pointer-events-none" />

          {/* Svg Circular Energy Chart */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-neutral-100"
                cx="88"
                cy="88"
                fill="transparent"
                r="76"
                stroke="currentColor"
                strokeWidth="7"
              />
              <motion.circle
                className="text-primary"
                cx="88"
                cy="88"
                fill="transparent"
                r="76"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray="477.52"
                initial={{ strokeDashoffset: 477.52 }}
                animate={{ strokeDashoffset: 477.52 - (477.52 * energyPercent) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-sans font-bold text-4xl text-primary leading-none">
                {energyPercent}
              </span>
              <span className="text-[10px] text-on-surface-variant font-semibold tracking-widest mt-1">
                PERCENT
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <span className="text-base font-bold text-primary font-display">
              今日能量儲備
            </span>
            <span className="inline-flex items-center gap-1 mt-2 px-3.5 py-1.5 bg-[#d2e8db] text-[#384b42] font-semibold rounded-full text-xs font-sans">
              <Zap className="w-3.5 h-3.5 fill-current text-primary" />
              {modeLabel}
            </span>
          </div>
        </div>

        {/* Right Shortcuts grid */}
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setShowCalendarModal(true)}
            className="bg-white p-5 rounded-2xl flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer group border border-black/5"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-bold text-base font-display text-primary">
                同步日曆
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                4 個待辦行程
              </p>
            </div>
          </div>

          <div
            onClick={() => setShowVaultModal(true)}
            className="bg-white p-5 rounded-2xl flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer group border border-black/5"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shadow-sm">
              <Archive className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-bold text-base font-display text-primary">
                任務庫
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {tasks.length} 個累積任務
              </p>
            </div>
          </div>

          {/* Switch to Analytics Tab item */}
          <div
            onClick={() => onNavigateToTab("scan")}
            className="col-span-2 bg-primary text-[#ffffff] p-5 rounded-2xl flex items-center justify-between hover:bg-neutral-800 hover:scale-[0.99] transition-all cursor-pointer shadow-sm shadow-primary/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#1a2f2b] flex items-center justify-center">
                <LineChart className="w-5 h-5 text-[#b4ccc5]" />
              </div>
              <div>
                <p className="font-bold text-base font-display text-[#ffffff]">
                  查看數據分析
                </p>
                <p className="text-xs text-[#809792] font-sans mt-0.5">
                  分析本週專注效率曲線
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </section>

      {/* Core Tasks section */}
      <section className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-bold text-lg font-display text-primary flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            核心任務
          </h3>
          <span className="text-xs font-semibold text-on-surface-variant bg-neutral-100 px-3/2 py-1/2 rounded">
            剩餘 {remainingCount} 項
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(5,26,23,0.02)] flex items-start gap-4 hover:border-[#b4ccc5] border border-transparent transition-all ${
                task.completed ? "opacity-40" : ""
              }`}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  task.completed
                    ? "bg-[#d2e8db] border-[#d2e8db]"
                    : "border-neutral-300 hover:border-primary"
                }`}
              >
                {task.completed && <Check className="w-4.5 h-4.5 text-primary stroke-[3]" />}
              </button>

              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4
                    className={`font-semibold text-sm leading-snug text-primary ${
                      task.completed ? "line-through text-neutral-400" : ""
                    }`}
                  >
                    {task.title}
                  </h4>
                  <span className="text-[10px] font-bold font-sans bg-neutral-100 text-on-surface-variant px-3 py-0.5 rounded-full shrink-0">
                    {task.duration}m
                  </span>
                </div>
                {task.notes && (
                  <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                    {task.notes}
                  </p>
                )}
                {task.isSpecial && (
                  <div className="w-full h-1 bg-neutral-100 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "30%" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decorative Dawn Preview Image Card */}
      <section className="mb-8">
        <div className="relative w-full rounded-3xl overflow-hidden h-48 shadow-[0_4px_24px_rgba(5,26,23,0.04)]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZu19i6F0Ph42QqefmbpbFAau-9S1mHCtbqBLerLoNrrwclCb2GjkRxaUQTZDYB7dEOvCYE5vAuu-TR8ms2eKTBSsy9Pkv-eHlbdUWH0aUBG0Xft53tE9TAf8dIax5QkRe3U8EgbKmUS3ABi7HZx_kN87La8EN5MISzrvsxN4AnvFAVKqafQixt1iwYxpiBGWHe-ksTnMq9Jsf3ynFjM4M0oyluRol8mBsxzT_aPFpagZ_YeGlWVGgJafCmGkQ7FsjLyQH64J0eOg"
            alt="Zen Sanctuary"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Cover gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051a17]/90 via-[#051a17]/20 to-transparent flex flex-col justify-end p-5">
            <span className="text-xs bg-white/20 text-[#d0e8e1] px-3 py-0.5 rounded-full backdrop-blur-md w-fit mb-1 font-display self-start font-semibold border border-white/10">
              晚間預覽
            </span>
            <p className="text-white text-base font-bold font-display leading-snug">
              已累積 4 小時深度工作
            </p>
            <p className="text-[#b4ccc5] text-xs font-sans mt-0.5 md:max-w-md">
              晚間 20:30 建議關閉螢幕，並進行 45 分鐘紙本閱讀與拉伸，能提升明日 HRV 指數。
            </p>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <AnimatePresence>
        {showCalendarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  今日待辦行程 (4)
                </h3>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="border-l-4 border-primary pl-3 py-1 bg-neutral-50 rounded">
                  <p className="text-xs font-bold text-neutral-400 font-sans">08:00 - 09:00</p>
                  <p className="text-sm font-semibold text-primary">晨間冥想與營養早餐</p>
                </div>
                <div className="border-l-4 border-secondary pl-3 py-1 bg-neutral-50 rounded">
                  <p className="text-xs font-bold text-neutral-400 font-sans">09:00 - 11:30</p>
                  <p className="text-sm font-semibold text-primary">深層工作：專案策略 (核心)</p>
                </div>
                <div className="border-l-4 border-neutral-400 pl-3 py-1 bg-neutral-50 rounded opacity-60">
                  <p className="text-xs font-bold text-neutral-400 font-sans">14:00 - 14:45</p>
                  <p className="text-sm font-semibold text-primary">團隊周會</p>
                </div>
                <div className="border-l-4 border-[#d2e8db] pl-3 py-1 bg-neutral-50 rounded">
                  <p className="text-xs font-bold text-neutral-400 font-sans">16:00 - 16:30</p>
                  <p className="text-sm font-semibold text-primary">瑜伽與身心回復拉伸</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showVaultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary font-display flex items-center gap-2">
                  <Archive className="w-5 h-5 text-primary" />
                  專屬任務庫 ({tasks.length})
                </h3>
                <button
                  onClick={() => setShowVaultModal(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-neutral-100"
                  >
                    <div>
                      <p className="text-xs font-semibold text-primary">{task.title}</p>
                      <p className="text-[10px] text-on-surface-variant font-sans">{task.duration}m · {task.timeLabel}</p>
                    </div>
                    {task.completed ? (
                      <span className="text-[10px] font-sans font-semibold bg-neutral-200/60 text-secondary px-2 py-0.5 rounded">
                        已完成
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans font-semibold bg-accent/40 text-primary-fixed-variant px-2 py-0.5 rounded">
                        未完成
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
