import { motion } from "motion/react";
import {
  ArrowLeft,
  Settings,
  Award,
  Zap,
  Calendar,
  Flower2,
  Lock,
  Sparkles,
  ChevronRight,
  User,
  Bell,
  Shield,
  RefreshCw,
  LogOut,
  Check
} from "lucide-react";

interface ProfileViewProps {
  onLogout: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function ProfileView({ onLogout, onNavigateToTab }: ProfileViewProps) {
  const badges = [
    { id: 1, title: "專注大師", icon: Zap, bgClass: "bg-[#e6deff]", iconColor: "text-primary" },
    { id: 2, title: "恆毅之王", icon: Calendar, bgClass: "bg-[#d2e8db]", iconColor: "text-secondary" },
    { id: 3, title: "平靜內心", icon: Flower2, bgClass: "bg-[#d0e8e1]", iconColor: "text-primary" },
    { id: 4, title: "睡眠守護", icon: Lock, bgClass: "bg-neutral-100", iconColor: "text-neutral-400", isLocked: true },
  ];

  const handleSettingClick = (settingName: string) => {
    alert(`系統設置已打開：【${settingName}】配置已與雲端同步。`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pb-32 px-6 pt-4 font-sans"
    >
      {/* AppBar */}
      <header className="w-full sticky top-0 bg-[#fbf9f8] z-40 flex justify-between items-center py-4 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateToTab("dashboard")}
            className="p-2 hover:bg-neutral-200/50 transition-colors rounded-full text-primary cursor-pointer active-scale"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold font-display text-primary tracking-tight">
            個人資料
          </h1>
        </div>
        <button
          onClick={() => handleSettingClick("系統總體偏好與暗黑模式設置")}
          className="p-2 hover:bg-neutral-200/50 transition-colors rounded-full text-primary cursor-pointer active-scale"
        >
          <Settings className="w-5 h-5 text-on-surface-variant" />
        </button>
      </header>

      {/* User info Section */}
      <section className="flex flex-col items-center pt-4 mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-[0_4px_24px_rgba(5,26,23,0.08)]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdjOlJXbjluqqcXzF2Koa2ciIR9P8p2BspyfZYtzxPzoqWY8W1AQEkLEdEciWkGEkxDm7qQdEuqttY-DEqXT7yNphqqW_JCI_h3wl1-_--qgnKns6aENx9c12eKqTupMD3toGi5nEX7nWj5ujP-FJZkw59Qz7nx2y8OslVCHJcUQzQR7TsrLKqWzj8DgxzpBLm87Sw20VGi_RpRVzHqgW1w6BmEf1tnuTcgwnC6fm7uJls5QCjdoTGL0H91mPH34rfCHjl-87rN70"
              alt="陳先生"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold font-display text-primary tracking-tight">
            陳先生
          </h2>
          <div className="inline-flex items-center gap-1 mt-1 bg-accent/50 px-3.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
            <span className="text-[10px] uppercase font-bold font-sans text-primary tracking-wider">
              Premium Member
            </span>
          </div>
        </div>
      </section>

      {/* Badges Slider section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base font-display text-primary">
            成就勳章
          </h3>
          <button
            onClick={() => alert("徽章功能：完成 30 天深層高阻冥想可解鎖「睡眠守護」勳章。")}
            className="text-primary font-bold text-xs underline cursor-pointer"
          >
            查看全部
          </button>
        </div>

        {/* Horizontal flex badges list */}
        <div className="flex gap-4 overflow-x-auto pb-2 select-none justify-start no-scrollbar pr-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex-shrink-0 flex flex-col items-center gap-2 ${
                badge.isLocked ? "opacity-40" : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full ${badge.bgClass} flex items-center justify-center shadow-[0_4px_16px_rgba(5,26,23,0.02)]`}
              >
                <badge.icon className={`w-8 h-8 ${badge.iconColor} stroke-[1.5]`} />
              </div>
              <span className="text-xs font-bold text-on-surface-variant text-center font-display">
                {badge.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Membership details Card */}
      <section className="mb-8">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col gap-5 border-l-4 border-primary">
          <div className="flex justify-between items-start z-10">
            <div>
              <h4 className="font-bold text-base font-display text-primary">
                Premium 方案使用中
              </h4>
              <p className="text-xs text-on-surface-variant font-sans mt-0.5">
                下次自動扣款日期：2026年12月15日
              </p>
            </div>
            <Award className="w-8 h-8 text-primary opacity-20" />
          </div>
          <button
            onClick={() => alert("目前訂閱管理：您的方案由 App Store 安全託管，已開通所有智慧健康指標與歷史專注詳解分析。")}
            className="w-full bg-primary text-[#ffffff] py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-neutral-800 transition-colors active-scale"
          >
            管理訂閱項目
          </button>
        </div>
      </section>

      {/* Setting links rows list */}
      <section className="flex flex-col gap-4 mb-4">
        <h3 className="font-bold text-base font-display text-primary px-1">
          帳戶設定
        </h3>
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(5,26,23,0.02)] border border-neutral-100 overflow-hidden">
          {/* Item 1 */}
          <button
            onClick={() => handleSettingClick("帳戶資訊（個人資料、HRV基準水準、日常作息表）")}
            className="w-full flex items-center justify-between p-5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <User className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-bold text-sm text-primary font-display">
                帳戶資訊
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
          </button>

          {/* Item 2 */}
          <button
            onClick={() => handleSettingClick("通知設定（專注阻截推送、能量恢復提醒、智能鬧鐘）")}
            className="w-full flex items-center justify-between p-5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-bold text-sm text-primary font-display">
                通知管理
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
          </button>

          {/* Item 3 */}
          <button
            onClick={() => handleSettingClick("隱私與數據安全保護（端對端本機加密、生物特徵抹除）")}
            className="w-full flex items-center justify-between p-5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-bold text-sm text-primary font-display">
                隱私權與安全
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
          </button>

          {/* Item 4 */}
          <button
            onClick={() => handleSettingClick("同步手環及外部裝置資料（與 Apple Health / Google Fit 介面同步）")}
            className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-bold text-sm text-primary font-display">
                裝置同步設定
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
          </button>
        </div>
      </section>

      {/* Red Logout Button */}
      <section className="mt-8 mb-4">
        <button
          onClick={onLogout}
          id="btn-logout"
          className="w-full py-4 bg-red-50 text-red-600 font-sans font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors cursor-pointer active-scale"
        >
          <LogOut className="w-4 h-4 stroke-[2.5]" />
          登出帳號
        </button>
      </section>
    </motion.div>
  );
}
