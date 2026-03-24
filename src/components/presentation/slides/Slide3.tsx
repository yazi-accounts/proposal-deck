import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import { ChevronLeft, ChevronRight, Globe, BarChart3, DollarSign, MessageCircle } from "lucide-react";
import langSetup from "@/assets/lang-translation-setup.png";
import langDetail from "@/assets/lang-translation-detail.png";

const languages = [
  { flag: "🇿🇦", name: "Zulu" },
  { flag: "🇳🇬", name: "Yoruba" },
  { flag: "🇫🇷", name: "French" },
  { flag: "🇪🇸", name: "Spanish" },
  { flag: "🇧🇷", name: "Portuguese" },
  { flag: "🇸🇦", name: "Arabic" },
  { flag: "🇰🇪", name: "Swahili" },
  { flag: "🇮🇳", name: "Hindi" },
  { flag: "🇨🇳", name: "Mandarin" },
  { flag: "🇩🇪", name: "German" },
  { flag: "🇯🇵", name: "Japanese" },
  { flag: "🇹🇷", name: "Turkish" },
  { flag: "🇮🇩", name: "Bahasa" },
  { flag: "🇹🇭", name: "Thai" },
  { flag: "🇻🇳", name: "Vietnamese" },
  { flag: "🇵🇱", name: "Polish" },
];

const tickerItems = [...languages, ...languages];
const images = [langSetup, langDetail];

const features = [
  { icon: Globe, title: "Native Language", desc: "Respondents answer in their native language for authentic insights." },
  { icon: BarChart3, title: "Real-Time Translation", desc: "Automatic translation for seamless cross-language analysis." },
  { icon: DollarSign, title: "Zero Translation Cost", desc: "No translation ops, vendors, or additional cost required." },
  { icon: MessageCircle, title: "Text + Voice", desc: "Works across text responses and voice note transcription." },
];

const Slide3 = () => {
  const [activeImg, setActiveImg] = useState(0);
  const goPrev = () => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1));
  const goNext = () => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-4 md:px-16 lg:px-24 max-w-7xl mx-auto py-2 md:py-6 overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <p className="slide-label mb-1 md:mb-2 text-center">Multilingual</p>
      </motion.div>
      <motion.div variants={fadeUp}>
        <h2 className="slide-subheadline text-xl md:text-4xl mb-2 md:mb-4 text-center">
          Run research in<br />
          <span className="italic">any language.</span> Instantly.
        </h2>
      </motion.div>

      {/* Language ticker */}
      <motion.div variants={fadeUp} className="mb-2 md:mb-5">
        <div className="overflow-hidden max-w-[90vw] md:max-w-3xl">
          <div className="flex gap-4 md:gap-6 animate-ticker">
            {tickerItems.map((lang, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 md:gap-2 shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/60"
              >
                <span className="text-base md:text-xl">{lang.flag}</span>
                <span className="text-xs md:text-sm font-medium text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features grid */}
      <motion.div variants={fadeUp} className="mb-2 md:mb-5 w-full max-w-[900px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 md:gap-3">
              <div className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-muted/60 flex items-center justify-center">
                <f.icon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] md:text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.title}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-snug hidden md:block" style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Image carousel */}
      <motion.div variants={fadeUp} className="w-full">
        <div className="flex items-center gap-3 md:gap-6 justify-center w-full">
          <button
            onClick={goPrev}
            className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </button>

          <div className="flex flex-col items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div
              className="relative w-full overflow-hidden rounded-xl border border-border shadow-lg bg-card max-h-[35vh] md:max-h-[50vh]"
              style={{ maxWidth: "900px" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={`Translation screenshot ${activeImg + 1}`}
                  className="w-full h-full object-cover object-top block"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease }}
                />
              </AnimatePresence>
            </div>
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    i === activeImg
                      ? "bg-foreground scale-110"
                      : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={goNext}
            className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default Slide3;
