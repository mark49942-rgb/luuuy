import { useState } from "react";
import { LayoutDashboard, Clock, Activity, User } from "lucide-react";
import WelcomeHero from "./components/WelcomeHero";
import Dashboard from "./components/Dashboard";
import TimelineView from "./components/TimelineView";
import InsightsScan from "./components/InsightsScan";
import ProfileView from "./components/ProfileView";
import { Task, TimelineItem, ScanResult } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("intro");

  // State coordination for tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "深度研究：AI 模型優化論文",
      duration: 90,
      timeLabel: "10:00",
      completed: false,
      notes: "建議於 10:00 能量高峰期開始",
      isSpecial: true,
    },
    {
      id: "task-2",
      title: "團隊週會資料準備",
      duration: 45,
      timeLabel: "14:00",
      completed: false,
      notes: "預計 14:00 進行",
    },
    {
      id: "task-3",
      title: "冥想與能量恢復",
      duration: 15,
      timeLabel: "下午",
      completed: false,
      notes: "建議在午餐後進行",
    },
  ]);

  // State coordination for timeline
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: "t-1",
      timeRange: "08:00 - 09:00",
      title: "晨間冥想與早餐",
      completed: true,
    },
    {
      id: "t-2",
      timeRange: "09:00 - 11:30",
      title: "深層工作：專案策略",
      completed: false,
      isFocusMode: true,
      description: "排除所有干擾，專注於核心系統架構設計。目前的能量水平：高度集中。",
    },
    {
      id: "t-3",
      timeRange: "11:30 - 12:00",
      title: "正念步行與伸展",
      completed: false,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBByFUSZkY7RpLLZTWG3LFqsx2O_kzSuTKIagBDGRRzo7kuYsCtOl44WxK93RoEpH4OFtYIwAPiyEe35HVFWK2GBKgigukVUg9zMVws1wAAFQaYbhisX0zbu6I2cwEZMCmsdJnKwQRWvgXTPVmTY35SGj6xdgIDPeWIwLfepvhgKeiD9a-Fh_MY5PXYKSqMPKXLbBfU0BmYj-7Z_R407T4JLuwWjNgUvALZAr6zZMsWeDEaU7SpCjz4mFm9OGtGBKa7PfOplDf7Hd8",
    },
    {
      id: "t-4",
      timeRange: "12:00 - 13:30",
      title: "團隊協作會議",
      completed: false,
      tags: ["會議記錄", "準備提案"],
    },
  ]);

  // State coordination for scan
  const [scanResult, setScanResult] = useState<ScanResult>({
    energyValue: 3,
    stressIndex: 45,
    applied: false,
  });

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTimelineItem = (item: TimelineItem) => {
    // Put at end or sort chronologically
    setTimelineItems((prev) => [...prev, item]);
  };

  const handleUpdateScanResult = (result: ScanResult) => {
    setScanResult(result);
    // If recommendation is applied, insert also inside timelineItems dynamically!
    if (result.applied) {
      const isAlreadyInTimeline = timelineItems.some((item) => item.title.includes("明日智慧創意"));
      if (!isAlreadyInTimeline) {
        setTimelineItems((prev) => [
          ...prev,
          {
            id: `apply-ai-${Date.now()}`,
            timeRange: result.peakHourRange || "10:00 - 11:30",
            title: "明日智慧創意工作 (AI建議)",
            completed: false,
            isFocusMode: true,
            description: result.aiRecommendation,
          },
        ]);
      }
    }
  };

  const handleLogout = () => {
    // Reset back to onboarding intro state
    setActiveTab("intro");
    setScanResult({
      energyValue: 3,
      stressIndex: 45,
      applied: false,
    });
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "intro":
        return <WelcomeHero onStartJourney={() => setActiveTab("dashboard")} />;
      case "dashboard":
        return (
          <Dashboard
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case "timeline":
        return (
          <TimelineView
            timelineItems={timelineItems}
            onAddTimelineItem={handleAddTimelineItem}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case "scan":
        return (
          <InsightsScan
            scanResult={scanResult}
            onUpdateScanResult={handleUpdateScanResult}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case "profile":
        return <ProfileView onLogout={handleLogout} onNavigateToTab={(tab) => setActiveTab(tab)} />;
      default:
        return <WelcomeHero onStartJourney={() => setActiveTab("dashboard")} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf9f8] md:bg-gradient-to-br md:from-[#eae6e1] md:to-[#d5ded8] flex items-center justify-center relative select-none overflow-x-hidden md:p-6 animate-fade-in">
      
      {/* Mobile Shell Mock Device Frame Container */}
      <div className="w-full max-w-[430px] h-screen md:h-[880px] bg-[#fbf9f8] relative flex flex-col md:rounded-[48px] md:shadow-[0_24px_80px_rgba(5,26,23,0.18)] md:border-[10px] md:border-[#051a17] overflow-hidden">
        
        {/* Dynamic Island / Notch Simulator */}
        <div className="hidden md:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-[#051a17] rounded-full z-50 items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#0f2a24] rounded-full mr-12 opacity-80" />
          <div className="w-1 h-1 bg-[#0f2a24] rounded-full opacity-60" />
        </div>

        {/* Mobile App Status Bar */}
        <div className="w-full h-11 shrink-0 px-6 pt-2 flex justify-between items-center text-[11px] font-sans font-bold text-primary z-45 bg-transparent select-none">
          <span>12:00 PM</span>
          <div className="flex items-center gap-2">
            {/* Cellular signal strength indicator */}
            <svg className="w-3.5 h-3.5 fill-current opacity-80" viewBox="0 0 24 24">
              <path d="M22 22H2L22 2z" />
            </svg>
            <span>5G</span>
            {/* Battery layout symbol */}
            <div className="w-5.5 h-3 border border-primary/85 rounded-xs p-0.5 flex items-center">
              <div className="h-full w-4/5 bg-primary/90 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Scrollable View Content Frame with hide scrollbar option */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {renderActiveScreen()}
        </div>

        {/* Real Mobile Absolute Bottom Navbar */}
        {activeTab !== "intro" && (
          <nav className="absolute bottom-0 left-0 right-0 w-full z-40 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(5,26,23,0.05)] border-t border-white/10 rounded-t-3xl">
            {/* Tab 1: Dashboard */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center p-2 hover:opacity-85 transition-opacity active:scale-95 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#d2e8db] text-[#55695f] rounded-full px-5 py-1.5 font-bold scale-102"
                  : "text-on-surface-variant font-medium"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">儀表板</span>
            </button>

            {/* Tab 2: Timeline */}
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex flex-col items-center justify-center p-2 hover:opacity-85 transition-opacity active:scale-95 cursor-pointer ${
                activeTab === "timeline"
                  ? "bg-[#d2e8db] text-[#55695f] rounded-full px-5 py-1.5 font-bold scale-102"
                  : "text-on-surface-variant font-medium"
              }`}
            >
              <Clock className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">時間軸</span>
            </button>

            {/* Tab 3: Today scanning insights */}
            <button
              onClick={() => setActiveTab("scan")}
              className={`flex flex-col items-center justify-center p-2 hover:opacity-85 transition-opacity active:scale-95 cursor-pointer ${
                activeTab === "scan"
                  ? "bg-[#d2e8db] text-[#55695f] rounded-full px-5 py-1.5 font-bold scale-102"
                  : "text-on-surface-variant font-medium"
              }`}
            >
              <Activity className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">洞察</span>
            </button>

            {/* Tab 4: Profile Settings */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center justify-center p-2 hover:opacity-85 transition-opacity active:scale-95 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#d2e8db] text-[#55695f] rounded-full px-5 py-1.5 font-bold scale-102"
                  : "text-on-surface-variant font-medium"
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-sans font-bold">個人資料</span>
            </button>
          </nav>
        )}

        {/* Apple iOS System Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-primary/15 rounded-full z-50 pointer-events-none hidden md:block" />

      </div>
    </div>
  );
}
