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
      title: "完成專題架構",
      duration: 90,
      timeLabel: "10:00",
      completed: false,
      notes: "整理章節與流程",
      isSpecial: true,
    },
    {
      id: "task-2",
      title: "修改簡報內容",
      duration: 60,
      timeLabel: "14:00",
      completed: false,
      notes: "補上設計心理學重點",
    },
    {
      id: "task-3",
      title: "整理訪談紀錄",
      duration: 45,
      timeLabel: "16:30",
      completed: false,
      notes: "萃取使用者痛點",
    },
  ]);

  // State coordination for timeline
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: "t-1",
      timeRange: "07:00 - 08:00",
      title: "晨間整理",
      completed: true,
      description: "喝水、早餐、確認今天狀態",
    },
    {
      id: "t-2",
      timeRange: "10:00 - 12:00",
      title: "專注任務：完成專題架構",
      completed: false,
      isFocusMode: true,
      description: "適合處理需要思考的內容，先完成最重要的部分。",
    },
    {
      id: "t-3",
      timeRange: "14:00 - 15:30",
      title: "修改簡報內容",
      completed: false,
      description: "調整頁面順序，補上設計心理學說明。",
    },
    {
      id: "t-4",
      timeRange: "16:00 - 16:30",
      title: "休息與伸展",
      completed: false,
      description: "離開螢幕，讓大腦恢復。",
    },
    {
      id: "t-5",
      timeRange: "20:30 - 21:00",
      title: "夜間回顧",
      completed: false,
      description: "記錄今天完成的事，安排明天重點。",
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
    // If recommendation is applied, insert also inside timelineItems dynamically and jump page!
    if (result.applied) {
      setActiveTab("timeline");

      const score = result.answers?.totalScore || 18;

      if (score <= 10) {
        setTasks([
          {
            id: "task-ai-1",
            title: "整理筆記",
            duration: 25,
            timeLabel: "09:00",
            completed: false,
            notes: "低難度工作，輕鬆梳理思緒（25分鐘專注）",
          },
          {
            id: "task-ai-2",
            title: "回覆訊息",
            duration: 25,
            timeLabel: "10:00",
            completed: false,
            notes: "快速回覆日常簡單訊息（25分鐘專注）",
          }
        ]);

        setTimelineItems([
          {
            id: "apply-ai-1",
            timeRange: "09:00 - 09:25",
            title: "專注任務：整理筆記",
            completed: false,
            isFocusMode: true,
            description: "低能量模式：專注 25 分鐘，休息 10 分鐘，不給大腦過多壓力。",
          },
          {
            id: "apply-ai-2",
            timeRange: "10:00 - 10:25",
            title: "專注任務：回覆訊息",
            completed: false,
            isFocusMode: true,
            description: "低難度常規聯絡：專注 25 分鐘，完成後放空休息 10 分鐘。",
          },
          {
            id: "apply-ai-3",
            timeRange: "14:00 - 14:30",
            title: "散步與放鬆",
            completed: false,
            description: "以恢復狀態為主：離開螢幕放空 30 分鐘，舒緩大腦壓力。",
          },
          {
            id: "apply-ai-4",
            timeRange: "20:00 - 20:20",
            title: "夜間回顧",
            completed: false,
            description: "溫和回顧今天：記錄心情狀態，提早準備休息。",
          }
        ]);
      } else if (score <= 15) {
        setTasks([
          {
            id: "task-ai-1",
            title: "修改報告",
            duration: 40,
            timeLabel: "09:00",
            completed: false,
            notes: "中低難度工作（40分鐘專注）",
          },
          {
            id: "task-ai-2",
            title: "資料蒐集",
            duration: 40,
            timeLabel: "11:00",
            completed: false,
            notes: "中低難度工作（40分鐘專注）",
          },
          {
            id: "task-ai-3",
            title: "低強度運動",
            duration: 30,
            timeLabel: "15:00",
            completed: false,
            notes: "出門散步慢走，活動活絡身體",
          }
        ]);

        setTimelineItems([
          {
            id: "apply-ai-1",
            timeRange: "09:00 - 09:40",
            title: "專注任務：修改報告",
            completed: false,
            isFocusMode: true,
            description: "恢復模式：專注 40 分鐘，休息 10 分鐘。輕度動腦逐步推進項目。",
          },
          {
            id: "apply-ai-2",
            timeRange: "11:00 - 11:40",
            title: "專注任務：資料蒐集",
            completed: false,
            isFocusMode: true,
            description: "中低難度資料蒐集：工作 40 分鐘，隨後休息 10 分鐘。",
          },
          {
            id: "apply-ai-3",
            timeRange: "15:00 - 15:30",
            title: "運動與拉伸",
            completed: false,
            description: "活動關節、呼吸新鮮空氣，釋放身體疲勞。",
          },
          {
            id: "apply-ai-4",
            timeRange: "20:30 - 20:50",
            title: "夜間回顧",
            completed: false,
            description: "快速紀錄本日收穫，輕柔調息準備入睡。",
          }
        ]);
      } else if (score <= 20) {
        setTasks([
          {
            id: "task-ai-1",
            title: "完成專題",
            duration: 50,
            timeLabel: "09:00",
            completed: false,
            notes: "正常學習工作。撰寫章節框架（50分鐘專注）",
            isSpecial: true,
          },
          {
            id: "task-ai-2",
            title: "簡報設計",
            duration: 50,
            timeLabel: "11:00",
            completed: false,
            notes: "正常學習工作。設計排版視覺（50分鐘專注）",
          },
          {
            id: "task-ai-3",
            title: "資料整理",
            duration: 50,
            timeLabel: "14:00",
            completed: false,
            notes: "正常學習工作。分析並歸類訪談數據（50分鐘專注）",
          },
          {
            id: "task-ai-4",
            title: "閱讀文獻",
            duration: 50,
            timeLabel: "16:00",
            completed: false,
            notes: "正常學習工作。研讀領域相關文獻（50分鐘專注）",
          }
        ]);

        setTimelineItems([
          {
            id: "apply-ai-1",
            timeRange: "09:00 - 09:50",
            title: "專注任務：完成專題",
            completed: false,
            isFocusMode: true,
            description: "穩定模式：專注 50 分鐘，休息 10 分鐘。狀態平穩高效推進。",
          },
          {
            id: "apply-ai-2",
            timeRange: "11:00 - 11:50",
            title: "專注任務：簡報設計",
            completed: false,
            isFocusMode: true,
            description: "正常常規工作：專注 50 分鐘，調整畫面並美化結構。",
          },
          {
            id: "apply-ai-3",
            timeRange: "14:00 - 14:50",
            title: "專注任務：資料整理",
            completed: false,
            isFocusMode: true,
            description: "正常學習：專注 50 分鐘，休息 10 分鐘。抽絲剝繭理清架構。",
          },
          {
            id: "apply-ai-4",
            timeRange: "16:00 - 16:50",
            title: "專注任務：閱讀文獻",
            completed: false,
            isFocusMode: true,
            description: "正常工作：專注 50 分鐘，休息 10 分鐘。吸收前人研究精華。",
          },
          {
            id: "apply-ai-5",
            timeRange: "20:30 - 21:00",
            title: "一日工作回顧",
            completed: false,
            description: "登錄今日實踐成果，完成一天收尾，享受完全放鬆。",
          }
        ]);
      } else {
        setTasks([
          {
            id: "task-ai-1",
            title: "完成專題核心內容",
            duration: 90,
            timeLabel: "09:00",
            completed: false,
            notes: "優先安排高難度工作（90分鐘深度專注）",
            isSpecial: true,
          },
          {
            id: "task-ai-2",
            title: "考試準備",
            duration: 90,
            timeLabel: "11:00",
            completed: false,
            notes: "優先安排高難度工作（90分鐘深度專注）",
          },
          {
            id: "task-ai-3",
            title: "作品集製作",
            duration: 90,
            timeLabel: "14:00",
            completed: false,
            notes: "優先安排高難度工作（90分鐘深度專注）",
          },
          {
            id: "task-ai-4",
            title: "深度研究",
            duration: 90,
            timeLabel: "16:00",
            completed: false,
            notes: "優先安排高難度工作（90分鐘深度專注）",
          }
        ]);

        setTimelineItems([
          {
            id: "apply-ai-1",
            timeRange: "09:00 - 10:30",
            title: "專注任務：完成專題核心內容",
            completed: false,
            isFocusMode: true,
            description: "高效模式：專注 90 分鐘，休息 15 分鐘。全神貫注攻克硬核框架。",
          },
          {
            id: "apply-ai-2",
            timeRange: "11:00 - 12:30",
            title: "專注任務：考試準備",
            completed: false,
            isFocusMode: true,
            description: "高難度挑戰：專注 90 分鐘，深度複習，快速理清盲點。",
          },
          {
            id: "apply-ai-3",
            timeRange: "14:00 - 15:30",
            title: "專注任務：作品集製作",
            completed: false,
            isFocusMode: true,
            description: "高能量攻堅：專注 90 分鐘，整合重組核心案例與美感設計。",
          },
          {
            id: "apply-ai-4",
            timeRange: "16:00 - 17:30",
            title: "專注任務：深度研究",
            completed: false,
            isFocusMode: true,
            description: "高難度挑戰：專注 90 分鐘，休息 15 分鐘。徹底讀透頂尖最新論文。",
          },
          {
            id: "apply-ai-5",
            timeRange: "20:30 - 21:00",
            title: "高效日終總結",
            completed: false,
            description: "今日收穫巨大！記錄豐碩碩果，好好犒賞今天的超神狀態。",
          }
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
            scanResult={scanResult}
          />
        );
      case "timeline":
        return (
          <TimelineView
            timelineItems={timelineItems}
            onAddTimelineItem={handleAddTimelineItem}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            scanResult={scanResult}
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
