import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MoreVertical,
  Calendar,
  CheckCircle,
  Bolt,
  Trees,
  Users,
  Plus,
  X,
  Play,
  RotateCcw
} from "lucide-react";
import { TimelineItem } from "../types";

interface TimelineViewProps {
  timelineItems: TimelineItem[];
  onAddTimelineItem: (item: TimelineItem) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function TimelineView({
  timelineItems,
  onAddTimelineItem,
  onNavigateToTab,
}: TimelineViewProps) {
  // Real live countdown state! Starting at 102 seconds (1m 42s)
  const [timeLeft, setTimeLeft] = useState(102);
  const [isRunning, setIsRunning] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("14:00 - 15:00");
  const [newDesc, setNewDesc] = useState("");
  const [newTag, setNewTag] = useState("");

  // Decrement seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCreateItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const tags = newTag ? newTag.split(",").map((s) => s.trim()) : undefined;

    onAddTimelineItem({
      id: Math.random().toString(),
      timeRange: newTime,
      title: newTitle,
      completed: false,
      description: newDesc || undefined,
      tags: tags,
    });

    // Reset
    setNewTitle("");
    setNewTime("14:00 - 15:00");
    setNewDesc("");
    setNewTag("");
    setShowAddModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32 px-6 pt-4 relative"
    >
      {/* Top Header */}
      <header className="w-full sticky top-0 bg-[#fbf9f8]/90 backdrop-blur-md z-40 flex justify-between items-center py-4 mb-4">
        <button
          onClick={() => onNavigateToTab("dashboard")}
          className="p-2 hover:bg-neutral-200/50 transition-colors rounded-full text-primary cursor-pointer active-scale"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold font-display text-primary tracking-tight">
          Luuuy
        </h1>
        <button
          onClick={() => alert("目前支持檢視、新增時間軸日程。生物數據已與手環同步。")}
          className="p-2 hover:bg-neutral-200/50 transition-colors rounded-full text-primary cursor-pointer"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Countdown Panel Hero */}
      <section className="mb-8">
        <div className="glass-card rounded-3xl p-6 shadow-[0_4px_20px_rgba(5,26,23,0.03)] relative overflow-hidden backdrop-blur-xl border border-white/50">
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-neutral-100">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] font-bold font-sans text-primary tracking-widest">
                LIVE
              </span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant font-medium font-sans mb-1">
            目前進行中：深層工作
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="font-sans font-bold text-5xl text-primary tracking-tight">
                {formatTime(timeLeft)}
              </h2>
              <span className="text-xs text-on-surface-variant">
                剩餘時間
              </span>
            </div>

            {/* Micro Timer Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-full cursor-pointer flex items-center justify-center transition-all"
              >
                {isRunning ? (
                  <span className="text-xs text-primary font-bold px-1 py-0.5">PAUSE</span>
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current text-primary" />
                )}
              </button>
              <button
                onClick={() => setTimeLeft(102)}
                className="p-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-full cursor-pointer flex items-center justify-center transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slices of visual tracking */}
          <div className="mt-5 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              layout
              className="h-full bg-primary"
              animate={{ width: `${(timeLeft / 102) * 100}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </section>

      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-bold font-display text-primary">
            時間軸排程
          </h3>
          <p className="text-xs text-on-surface-variant font-sans mt-0.5">
            2026年5月31日，星期日
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-[#ffffff] p-3 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-neutral-800 active-scale"
        >
          <Calendar className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Timeline items list */}
      <div className="relative pl-6">
        {/* Continuous straight line */}
        <div className="absolute left-[9px] top-4 bottom-4 w-[1px] bg-accent/60 opacity-60" />

        <div className="flex flex-col gap-6">
          {timelineItems.map((item) => {
            const isCompleted = item.completed || (item.timeRange.startsWith("08:") && timeLeft < 100);

            return (
              <div
                key={item.id}
                className={`relative transition-all duration-300 ${isCompleted ? "opacity-40" : ""}`}
              >
                {/* Node icon / indicator positioned relative to central line */}
                <div className="absolute -left-[24px] top-1">
                  {item.isFocusMode ? (
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-[#d2e8db] flex items-center justify-center shadow-lg animate-pulse">
                      <Bolt className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#efeeec] border-4 border-[#fbf9f8] flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-neutral-400" : "bg-secondary"}`} />
                    </div>
                  )}
                </div>

                {/* Timeline Card content */}
                {item.isFocusMode ? (
                  <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(5,26,23,0.04)] border-l-4 border-primary overflow-hidden">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold font-sans text-primary mb-0.5 block">
                          {item.timeRange}
                        </span>
                        <h4 className="font-bold text-sm text-primary font-display">
                          {item.title}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 bg-[#d2e8db] text-[#384b42] text-[9px] font-bold rounded-full uppercase tracking-wider font-sans">
                        FOCUS
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}

                    {/* Team avatars stack mapping focus mode */}
                    <div className="flex -space-x-1.5 items-center">
                      <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-neutral-200">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA36rj7a586FGHYYc_HVbxC3ucMofZZzfnMWMQ7xzEfU1UtcfT_6QA6MndbIVDJBPkQvl48616LDCVJ4VVe83pZ8Kh69Fjfn0_lpnJMxeLooCMD-ikVTZo4L_n37nQElUa8OsqozNotriVgaQP2Lv4x_IQ-R90OyQNArcknS1-Uxo0mAO4aJloFni3Vy-LEEVSWA7SkTACwcah57-TKvqDz4KGUG0WCMIPY_waz7KUrtvzqx0BtzfO4HRUhhgqElvtXST5REWVX4Lg"
                          alt="Team member"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-primary text-white text-[9px] font-bold font-sans flex items-center justify-center">
                        +2
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-sans pl-2">
                        專案夥伴共同協同中
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start pl-2">
                      <div>
                        <span className="text-[10px] font-sans font-bold text-on-surface-variant block mb-0.5">
                          {item.timeRange}
                        </span>
                        <h4 className="font-bold text-sm text-primary font-display">
                          {item.title}
                        </h4>
                      </div>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-neutral-400 stroke-[2] fill-transparent" />
                      ) : item.title.includes("步行") ? (
                        <Trees className="w-4 h-4 text-secondary" />
                      ) : (
                        <Users className="w-4 h-4 text-secondary" />
                      )}
                    </div>

                    {/* Render sub details if present */}
                    {item.description && !item.imageUrl && (
                      <p className="text-xs text-on-surface-variant pl-2 mt-1 pr-1 leading-normal">
                        {item.description}
                      </p>
                    )}

                    {item.imageUrl && (
                      <div className="mt-3 pl-2 flex gap-2">
                        <div className="h-20 w-32 rounded-xl overflow-hidden shadow-sm border border-black/5">
                          <img
                            src={item.imageUrl}
                            alt="Zen"
                            className="w-full h-full object-cover select-none brightness-95 opacity-80"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    )}

                    {item.tags && (
                      <div className="mt-2 pl-2 flex flex-wrap gap-1.5">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-[#efeeec] text-[10px] text-on-surface-variant font-semibold rounded border border-neutral-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Floating Action button to Add Task Schedule */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed right-6 bottom-28 w-14 h-14 bg-primary text-[#ffffff] rounded-full shadow-xl flex items-center justify-center active-scale z-40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6 text-white stroke-[2.5]" />
      </button>

      {/* Floating Add Schedule Modal */}
      <AnimatePresence>
        {showAddModal && (
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
                <h3 className="font-bold text-lg text-primary font-display">
                  新增今日安排
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    安排名稱
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: 行業趨勢調研"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    時間範圍
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: 14:00 - 15:30"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    細節備註 (選填)
                  </label>
                  <textarea
                    placeholder="專注分析行業頂尖競品模型"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary font-sans h-16 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    標籤標記 (逗號分隔)
                  </label>
                  <input
                    type="text"
                    placeholder="例: 市場分析, AI報告"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-[#ffffff] font-sans font-semibold py-3 rounded-full mt-2 cursor-pointer shadow hover:bg-neutral-800 transition-colors"
                >
                  確認添加日誌
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
