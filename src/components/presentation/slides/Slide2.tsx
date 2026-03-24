import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import { Brain, Radar, BarChart3, Zap, GitBranch, Calendar, Clock } from "lucide-react";

import aiInterviewMockup from "@/assets/ai-interview-mockup.gif";
import surveyMockup from "@/assets/survey-mockup-new.gif";
import diaryStudyMockup from "@/assets/diary-study-mockup.png";

const methodologies = [
  {
    label: "AI Interview",
    subtitle: "Moderated depth at scale",
    features: [
      { icon: Brain, title: "Adaptive Probing", desc: "Research-grade AI follow-ups, not generic chatbot responses." },
      { icon: Radar, title: "Context-Aware", desc: "Dynamic follow-ups that adapt based on prior answers." },
      { icon: BarChart3, title: "Scale + Depth", desc: "Interview-quality insights at survey-level volume." },
    ],
    image: aiInterviewMockup,
    alt: "AI Interview WhatsApp mockup",
  },
  {
    label: "Survey",
    subtitle: "Structured data, fast",
    features: [
      { icon: Zap, title: "Fast Collection", desc: "Rapid structured data collection via WhatsApp." },
      { icon: GitBranch, title: "Smart Logic", desc: "Branching flows and skip logic built for mobile." },
    ],
    image: surveyMockup,
    alt: "Survey mockup",
  },
  {
    label: "Diary Study",
    subtitle: "Longitudinal insight",
    features: [
      { icon: Calendar, title: "Multi-Day Tasks", desc: "Longitudinal tasks scheduled over days or weeks." },
      { icon: Clock, title: "Behaviour Over Time", desc: "Captures habits, routines, and changes as they happen." },
    ],
    image: diaryStudyMockup,
    alt: "Diary Study mockup",
  },
];

const Slide2 = () => {
  const [active, setActive] = useState(0);

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Left column — text content */}
      <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-8">
        <motion.div variants={fadeUp}>
          <p className="slide-label mb-2 md:mb-4">Methodologies</p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <h2 className="slide-subheadline mb-6 md:mb-10">
            One platform.<br />
            <span className="italic">Three methodologies.</span>
          </h2>
        </motion.div>

        {/* Tab toggle */}
        <motion.div variants={fadeUp} className="mb-5 md:mb-8">
          <motion.div 
            className="inline-flex rounded-full border border-border/60 bg-muted/30 p-1 md:p-1.5 gap-1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {methodologies.map((m, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="relative px-4 md:px-7 py-2 md:py-2.5 text-[13px] md:text-[15px] font-medium rounded-full transition-all duration-300 text-center whitespace-nowrap"
                style={{ fontFamily: "'DM Sans', sans-serif", minWidth: "auto" }}
              >
                {i === active && (
                  <motion.div
                    layoutId="methodology-toggle"
                    className="absolute inset-0 rounded-full bg-foreground shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 ${
                  i === active ? "text-background" : "text-muted-foreground"
                }`}>
                  {m.label}
                </span>
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
            >
              <p className="slide-body font-medium text-foreground mb-3 md:mb-5 text-sm md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {methodologies[active].subtitle}
              </p>
              <div className="space-y-3 md:space-y-5">
                {methodologies[active].features.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted/60 flex items-center justify-center">
                      <item.icon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                      <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right column — phone mockup */}
      <div className="flex justify-center items-center px-4 md:px-8 py-2 md:py-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={methodologies[active].image}
            alt={methodologies[active].alt}
            className="max-h-[35vh] md:max-h-[75vh] w-auto object-contain"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease }}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Slide2;
