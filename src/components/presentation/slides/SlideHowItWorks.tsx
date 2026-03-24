import { motion } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import yaziLogo from "@/assets/yazi-logo-circle.png";

const flowSteps = [
  { emoji: "📦", label: "On-Pack QR Scan or Purchase Event", bg: "hsl(211, 75%, 35%)", color: "#fff" },
  { emoji: "💬", label: "WhatsApp Conversation Opens", bg: "#075E54", color: "#fff" },
  { emoji: "🤖", label: "AI Adaptive Interview (3–5 Qs)", bg: "hsl(var(--muted) / 0.6)", color: "hsl(var(--foreground))" },
  { emoji: "🔀", label: "Satisfied → NPS / Issue → Deep Probe", bg: "hsl(var(--muted) / 0.6)", color: "hsl(var(--foreground))" },
  { emoji: "📊", label: "Dashboard + Alert (Defect / Stock-Out)", bg: "hsl(var(--olive))", color: "#fff" },
];

const chatMessages = [
  { from: "bot", text: "Hey! 👋 Thanks for scanning. We'd love to hear about your Vuse experience — takes just 2 mins.", time: "14:32" },
  { from: "bot", text: "Q1 of 4 📋\nHow would you rate your overall experience with Vuse so far?", time: "14:32" },
  { from: "user", text: "Really enjoying it, the flavour is great but the battery could be better", time: "14:35" },
  { from: "bot", text: "Great to hear about the flavour! You mentioned the battery — how long does it typically last, and when does it fall short?", time: "14:35" },
  { from: "user", text: "About half a day. I use it on work breaks and it dies by evening", time: "14:37" },
  { from: "bot", text: "Q3 of 4 📋\nHave you noticed any stock availability issues at your usual store? Any flavours hard to find?", time: "14:37" },
];

const SlideHowItWorks = () => (
  <motion.div
    className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    {/* Left — flow diagram */}
    <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-8">
      <motion.div variants={fadeUp}>
        <p className="slide-label mb-2 md:mb-4">How It Works for BAT</p>
      </motion.div>
      <motion.div variants={fadeUp}>
        <h2 className="slide-subheadline mb-3 md:mb-5">
          From Trigger to<br />
          <span className="italic">Insight</span>
        </h2>
      </motion.div>
      <motion.div variants={fadeUp}>
        <p
          className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-sm mb-6 md:mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          A customer scans a QR code on their Vuse pack. Instantly, they're in a WhatsApp conversation — no app downloads, no survey links.
        </p>
      </motion.div>

      {/* Flow diagram */}
      <motion.div variants={fadeUp} className="flex flex-col items-start gap-0">
        {flowSteps.map((step, i) => (
          <div key={i} className="flex flex-col items-start">
            <motion.div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] md:text-[13px] font-medium min-w-[240px] md:min-w-[300px]"
              style={{ backgroundColor: step.bg, color: step.color, fontFamily: "'DM Sans', sans-serif" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1, ease }}
            >
              <span className="text-base">{step.emoji}</span>
              {step.label}
            </motion.div>
            {i < flowSteps.length - 1 && (
              <motion.div
                className="ml-6 flex flex-col items-center"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1, ease }}
                style={{ transformOrigin: "top" }}
              >
                <div className="w-0.5 h-4 md:h-5" style={{ backgroundColor: "hsl(var(--olive) / 0.3)" }} />
                <div
                  className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: "hsl(var(--olive) / 0.3)" }}
                />
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>

    {/* Right — phone mockup */}
    <div className="flex justify-center items-center px-4 md:px-8 py-4">
      <motion.div
        variants={fadeUp}
        className="relative w-[220px] h-[420px] md:w-[300px] md:h-[580px] rounded-[28px] md:rounded-[40px] border-[4px] md:border-[5px] border-[#1a1a1a] bg-[#1a1a1a] overflow-hidden"
        style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)" }}
      >
        {/* Dynamic island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[80px] md:w-[100px] h-[24px] md:h-[28px] bg-black rounded-full z-20" />

        {/* WhatsApp header */}
        <div className="bg-[#075E54] text-white px-3 md:px-4 pt-8 md:pt-9 pb-2 flex items-center gap-2 md:gap-3 z-10 relative">
          <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          <img src={yaziLogo} alt="Yazi" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover" />
          <div className="flex items-center gap-1.5">
            <p className="text-xs md:text-sm font-semibold leading-tight">BAT Research</p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#25D366" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="overflow-y-auto px-2 py-2 md:py-3 space-y-1.5"
          style={{
            height: "calc(100% - 80px)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: "#ECE5DD",
          }}
        >
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} px-1`}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.12, ease }}
            >
              <div
                className={`max-w-[82%] px-2.5 py-1.5 shadow-sm ${
                  msg.from === "user"
                    ? "bg-[#DCF8C6] rounded-lg rounded-br-none"
                    : "bg-white rounded-lg rounded-bl-none"
                }`}
              >
                <p className="text-[10px] md:text-[12px] text-gray-900 leading-snug whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[8px] md:text-[9px] text-gray-500">{msg.time}</span>
                  {msg.from === "user" && (
                    <svg width="12" height="8" viewBox="0 0 16 10" className="text-[#53BDEB]">
                      <path d="M1 5l3 3L9 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 5l3 3L13 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default SlideHowItWorks;
