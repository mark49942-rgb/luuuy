import { motion } from "motion/react";
import { Sparkles, Bolt, Download, Shield, Eye, Settings, Compass, LayoutDashboard } from "lucide-react";

interface WelcomeHeroProps {
  onStartJourney: () => void;
}

export default function WelcomeHero({ onStartJourney }: WelcomeHeroProps) {
  // Simple elements matching the luxury Zen theme
  const mockCurvePoints = [40, 60, 90, 70, 40, 30, 50, 85, 100, 80, 50, 20];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative pb-32 overflow-x-hidden"
    >
      {/* Decorative Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10" />

      {/* Main branding header */}
      <header className="w-full flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold tracking-wider text-primary font-display flex items-center gap-1">
          <Compass className="w-5 h-5 text-primary stroke-[2.5]" />
          Luuuy
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-accent/40 text-primary-fixed-variant px-3 py-1 rounded-full font-sans tracking-wide">
            v1.14 Premium
          </span>
        </div>
      </header>

      {/* Hero Body */}
      <section className="px-6 pt-8 pb-12 flex flex-col items-center text-center">
        {/* Glow Spherical Ambient Visual */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8 mt-4"
        >
          {/* Main Sphere with Radial Gradient */}
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center relative shadow-[0_0_80px_rgba(77,99,94,0.3)] bg-gradient-to-br from-[#d0e8e1] via-[#4d635e] to-[#051a17]">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-md pointer-events-none" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-white opacity-40"
            >
              <Sparkles className="w-16 h-16 stroke-[1]" />
            </motion.div>
          </div>

          {/* Floating Energy Indicator Badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-4 glass-card p-3 rounded-2xl flex items-center justify-center shadow-md border-white/50"
          >
            <Bolt className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>

        {/* Central Headlines */}
        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary leading-tight max-w-2xl mb-4 tracking-tight">
          掌握你的內在節奏，<br />
          開啟智慧生活
        </h1>
        
        <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-md mb-8 leading-relaxed">
          透過能量掃描與 AI 智慧導航，精準規劃每一天。我們致力於平衡您的身心效率，將科技轉化為最溫柔的陪伴。
        </p>

        {/* Primary CTA button with pulse hover effect */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onStartJourney}
          id="btn-start-journey"
          className="bg-primary text-[#ffffff] font-sans font-semibold px-12 py-4 rounded-full shadow-lg hover:bg-primary/95 transition-colors cursor-pointer active-scale flex items-center gap-2 group"
        >
          開始旅程
          <LayoutDashboard className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </section>

      {/* Bento Grid Features Section */}
      <section className="px-6 py-8 max-w-4xl mx-auto flex flex-col gap-6">
        <h2 className="text-lg font-bold font-display text-primary px-2 border-l-4 border-primary/40 pl-3">
          核心系統優勢
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Large Bento Item */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-between group overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-3 text-secondary">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs tracking-widest uppercase font-sans font-semibold">
                  能量智慧分析
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-primary mb-2">
                深度能量監測系統
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
                結合生物反饋數據，分析您的日常專注週期，為您找出最高效的黃金時段。
              </p>
            </div>
            <div className="mt-6 relative h-40 rounded-xl overflow-hidden shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCUFGkRBxNZpKt8clMtLXTq3pkXy-I8I6Q8dq780BN7hoK6gAWLlqbgUgM6Qy1EidAkV6Jk0B8_svNf2Vk8akRCS-byw5YC6K36c8AaSWUQxfI4ZVTAnZDppnr4sYhcNWxvKkjZTYtd6F93xlOkWttGwIlbCgFRLgDh_y4Cyf9kTqHS3MUsXMXbErfM9nv1bp-_6PPScKlqNDeoxqCQWwyKPU-IrAsR6sXtY05dWXUN8E9kx_fmR5GU3pnZS1FgHi63SzXKDm7Gpg"
                alt="深度能量監測系統介面"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* AI Helper Bento Item */}
          <div className="bg-[#d2e8db]/60 p-6 rounded-2xl flex flex-col justify-between border border-black/5 text-primary">
            <div>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold font-display mb-2">
                AI 智慧導航
              </h3>
              <p className="text-xs text-primary/80 leading-relaxed mb-4">
                自動調整待辦事項，確保您在能量飽滿時處理高負荷關鍵任務。
              </p>
            </div>

            {/* Simulated Live Energy Badge */}
            <div className="glass-card p-4 rounded-xl flex items-center gap-3 border-white/40">
              <div className="w-2 h-8 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-4/5 bg-primary w-full" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-primary/90 mb-1">
                  今日剩餘能量 82%
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[82%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Sub Row 1: Restoration */}
          <div className="bg-[#efeeec] p-5 rounded-2xl border border-black/5">
            <span className="text-xs bg-white text-secondary px-2 py-0.5 rounded-full font-semibold font-display inline-block mb-3">
              Restorative
            </span>
            <h4 className="font-bold text-sm text-primary mb-1">
              冥想與自我修復
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              在低能量的恢復階段，為您提供專屬的修習與放鬆方案。
            </p>
          </div>

          {/* Sub Row 2: Analytics */}
          <div className="bg-primary text-[#ffffff] p-5 rounded-2xl shadow-md border border-neutral-800">
            <span className="text-xs bg-white/15 text-white bg-opacity-10 px-2 py-0.5 rounded-full font-semibold font-sans inline-block mb-3">
              Data Insights
            </span>
            <h4 className="font-bold text-sm mb-1">
              生物數據視覺化
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              一目了然的成長曲線、身心回復進程與每日精力報告。
            </p>
          </div>

          {/* Sub Row 3: Security */}
          <div className="bg-white p-5 rounded-2xl border border-black/5 md:col-span-2 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-accent/20 rounded-full group-hover:scale-125 transition-transform duration-500 ease-out" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#efeeec] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary mb-1">
                  極致隱私承諾
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  端對端加密，所有個人心率變異度 (HRV) 與生物特徵數據僅安全儲存於本機，不會洩露給第三方。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Energy Curve Preview Visualization */}
      <section className="px-6 py-8 bg-[#efeeec]/30 mt-6 border-y border-black/5">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="text-lg font-bold font-display text-primary mb-1">
            視覺化您的內在節奏
          </h2>
          <p className="text-xs text-on-surface-variant">
            告別盲目消耗，順應生理週期，與時間輕盈共舞
          </p>
        </div>

        {/* Dynamic decorative visual bar chart */}
        <div className="max-w-xl mx-auto glass-card rounded-2xl p-6 min-h-[160px] flex items-end gap-1 px-8 border-white/60">
          {mockCurvePoints.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              className="flex-1 bg-primary/40 rounded-t-full"
              style={{
                backgroundColor:
                  idx === 8 ? "var(--color-primary)" : "rgba(5, 26, 23, 0.4)",
              }}
            />
          ))}
        </div>

        <div className="flex justify-between max-w-xl mx-auto mt-3 text-[10px] text-on-surface-variant font-sans px-4">
          <span>上午 06:00</span>
          <span>中午 12:00</span>
          <span>下午 06:00</span>
          <span>午夜 12:00</span>
        </div>
      </section>

      {/* Footer CTA & Information */}
      <section className="px-6 py-12 text-center">
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white shadow-sm border border-black/5">
          <h2 className="text-base font-bold font-display text-primary mb-2">
            準備好開啟您的 Luuuy 旅程了嗎？
          </h2>
          <p className="text-xs text-on-surface-variant mb-6">
            加入 10,000+ 高敏專注者的身心效率航線。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartJourney}
              className="bg-primary text-[#ffffff] text-xs font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-primary/95 shadow-sm inline-flex active-scale cursor-pointer"
            >
              <Download className="w-4 h-4" /> App Store 下載
            </button>
            <button
              onClick={onStartJourney}
              className="border border-primary text-primary text-xs font-semibold px-6 py-3 rounded-full hover:bg-primary/5 inline-flex justify-center items-center active-scale cursor-pointer"
            >
              了解更多
            </button>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant/60 mt-12">
          © 2026 Luuuy. 保留所有權利。
        </p>
      </section>
    </motion.div>
  );
}
