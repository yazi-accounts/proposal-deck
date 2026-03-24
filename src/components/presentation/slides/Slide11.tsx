import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp } from "../animations";
import yaziLogo from "@/assets/yazi-logo-circle.png";
import { supabase } from "@/integrations/supabase/client";

const COUNTRIES = [
  { code: "ZA", dial: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "US", dial: "+1",  flag: "🇺🇸", name: "United States" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "NG", dial: "+234",flag: "🇳🇬", name: "Nigeria" },
  { code: "KE", dial: "+254",flag: "🇰🇪", name: "Kenya" },
  { code: "GH", dial: "+233",flag: "🇬🇭", name: "Ghana" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "CA", dial: "+1",  flag: "🇨🇦", name: "Canada" },
  { code: "AE", dial: "+971",flag: "🇦🇪", name: "UAE" },
  { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "ZW", dial: "+263",flag: "🇿🇼", name: "Zimbabwe" },
  { code: "ZM", dial: "+260",flag: "🇿🇲", name: "Zambia" },
  { code: "TZ", dial: "+255",flag: "🇹🇿", name: "Tanzania" },
];

type Message = {
  id: number;
  text: string;
  from: "bot" | "user";
  time: string;
};

const botQuestions = [
  "👋 Hey there! Welcome to Yazi. We'd love to show you how conversational research works. Let's book a quick demo — it only takes a sec!",
  "What's your name?",
  "Nice to meet you! What's your WhatsApp number?",
  "And your email address?",
];

const getTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const TypingIndicator = () => (
  <div className="flex items-end gap-1 px-3 py-2">
    <div className="bg-white rounded-lg rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          style={{
            animation: "typingDot 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const ChatBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.from === "user";
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-3`}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className={`max-w-[80%] px-3 py-2 shadow-sm ${
          isUser
            ? "bg-[#DCF8C6] rounded-lg rounded-br-none"
            : "bg-white rounded-lg rounded-bl-none"
        }`}
      >
        <p className="text-[13px] text-gray-900 leading-snug whitespace-pre-wrap">{msg.text}</p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[10px] text-gray-500">{msg.time}</span>
          {isUser && (
            <svg width="16" height="10" viewBox="0 0 16 10" className="text-[#53BDEB]">
              <path d="M1 5l3 3L9 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 5l3 3L13 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Slide11 = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initiated = useRef(false);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addBotMessage = useCallback(
    (text: string, nextStep: number) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text, from: "bot", time: getTime() },
        ]);
        setStep(nextStep);
        setTimeout(scrollToBottom, 50);
      }, 800 + Math.random() * 400);
    },
    [scrollToBottom]
  );

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;
    setTimeout(() => {
      addBotMessage(botQuestions[0], 0);
      setTimeout(() => {
        addBotMessage(botQuestions[1], 1);
      }, 1400);
    }, 600);
  }, [addBotMessage]);

  const handleSend = async () => {
    if (!input.trim() || typing || done) return;

    const displayText = step === 2
      ? `${selectedCountry.flag} ${selectedCountry.dial} ${input.trim()}`
      : input.trim();

    const buildPhone = (raw: string) => {
      const digits = raw.replace(/\D/g, "");
      return `${selectedCountry.dial}${digits}`;
    };

    const userMsg: Message = {
      id: Date.now(),
      text: displayText,
      from: "user",
      time: getTime(),
    };
    const currentInput = input.trim();
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(scrollToBottom, 50);

    if (step === 1) {
      setUserName(currentInput);
      addBotMessage(botQuestions[2], 2);
    } else if (step === 2) {
      const fullPhone = buildPhone(currentInput);
      addBotMessage(botQuestions[3], 3);

      try {
        await supabase.functions.invoke("trigger-yazi", {
          body: { phone_number: fullPhone, user_name: userName },
        });
      } catch (e) {
        console.error("Failed to trigger Yazi:", e);
      }
    } else if (step === 3) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: "✅ Thanks! We'll be in touch on WhatsApp shortly!", from: "bot", time: getTime() },
        ]);
        setDone(true);
        setTimeout(scrollToBottom, 50);
      }, 1000);
    }
  };

  const placeholder =
    step === 1 ? "Type your name..." : step === 2 ? "Phone number..." : step === 3 ? "Your email address..." : "Message";

  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-start md:justify-center h-full px-4 md:px-12 lg:px-24 pt-14 md:pt-0 gap-2 md:gap-10 max-w-6xl mx-auto overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Left text */}
      <div className="flex-none md:flex-1 max-w-md text-center md:text-left">
        <motion.div variants={fadeUp}>
          <p className="slide-label mb-2 md:mb-4">Book a Demo</p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <h2 className="slide-subheadline mb-3 md:mb-6">
            Experience it<br />
            <span className="italic">first-hand.</span>
          </h2>
        </motion.div>
        <motion.div variants={fadeUp}>
          <p className="slide-body text-sm md:text-base">
            See how Yazi can transform consumer research for BAT's New Categories and combustibles portfolio. Book a demo in seconds.
          </p>
        </motion.div>
      </div>

      {/* Phone mockup */}
      <motion.div variants={fadeUp} className="shrink-0 flex flex-col items-center">
        {/* Floating CTA above phone — pill style */}
        <motion.div
          className="flex flex-col items-center mb-3 md:mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="flex items-center gap-2 px-5 py-2 rounded-full border mb-2"
            style={{ backgroundColor: "hsla(145, 63%, 49%, 0.12)", borderColor: "hsla(145, 63%, 49%, 0.25)" }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span
              className="text-xs md:text-sm font-semibold tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(145, 63%, 38%)" }}
            >
              Try it out — chat below
            </span>
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              👇
            </motion.span>
          </motion.div>
        </motion.div>
        <div className="relative w-[200px] h-[340px] md:w-[300px] md:h-[520px] lg:h-[620px] rounded-[26px] md:rounded-[40px] border-[3px] md:border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl overflow-hidden" style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[80px] md:w-[100px] h-[24px] md:h-[28px] bg-black rounded-full z-20" />
          {/* WhatsApp header */}
          <div className="bg-[#075E54] text-white px-3 md:px-4 pt-8 md:pt-9 pb-2 flex items-center gap-2 md:gap-3 z-10 relative">
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            <img src={yaziLogo} alt="Yazi" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover" />
            <div className="flex items-center gap-1.5">
              <p className="text-xs md:text-sm font-semibold leading-tight">Yazi Research</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#25D366" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto px-1 py-2 md:py-3 space-y-2"
            style={{
              height: "calc(100% - 110px)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundColor: "#ECE5DD",
            }}
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-[#F0F0F0] px-2 py-2 flex flex-col gap-1.5 z-10">
            {/* Country picker dropdown */}
            <AnimatePresence>
              {step === 2 && !done && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <button
                    onClick={() => setCountryOpen((o) => !o)}
                    className="w-full bg-white rounded-full px-3 py-1.5 flex items-center gap-2 text-[11px] md:text-[12px] text-gray-700 border border-gray-200"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span className="font-medium">{selectedCountry.name}</span>
                    <span className="text-gray-400 ml-auto">{selectedCountry.dial}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className={`transition-transform ${countryOpen ? "rotate-180" : ""}`}>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {countryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-y-auto max-h-[140px] z-30"
                      >
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setSelectedCountry(c); setCountryOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] hover:bg-gray-50 text-left ${selectedCountry.code === c.code ? "bg-gray-50 font-semibold" : ""}`}
                          >
                            <span>{c.flag}</span>
                            <span className="flex-1 text-gray-700">{c.name}</span>
                            <span className="text-gray-400">{c.dial}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-3 md:px-4 py-1.5 md:py-2 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={placeholder}
                  disabled={done || step === 0}
                  className="w-full text-[12px] md:text-[13px] bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || done || step === 0}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#075E54] flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </motion.div>
  );
};

export default Slide11;
