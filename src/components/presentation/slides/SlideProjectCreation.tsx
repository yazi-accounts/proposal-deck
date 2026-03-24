import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import { ChevronLeft, ChevronRight, Zap, Target, Settings, MonitorPlay, Sparkles, GitBranch, Calendar, Route } from "lucide-react";
import briefSetupMethod from "@/assets/brief-setup-method.png";
import briefUpload from "@/assets/brief-upload.png";
import scriptingBuilder from "@/assets/scripting-builder.png";
import scriptingLogic from "@/assets/scripting-logic.png";
import aiInterviewConfig from "@/assets/ai-interview-config.png";
import aiInterviewMedia from "@/assets/ai-interview-media.png";
import diaryStudySequencing from "@/assets/diary-study-sequencing.png";
import diaryStudyRouting from "@/assets/diary-study-routing.png";

const tabData = [
  {
    label: "AI Brief",
    items: [
      { icon: Zap, title: "Instant Generation", desc: "Upload a Word or PDF brief to automatically create your entire study structure.", image: briefSetupMethod },
      { icon: Target, title: "Precision Drafting", desc: "AI accurately generates verbatim questions, significantly reducing setup time.", image: briefUpload },
    ],
  },
  {
    label: "Scripting",
    items: [
      { icon: Settings, title: "Intuitive Interface", desc: "Easy-to-use, drag-and-drop builder for full DIY control.", image: scriptingBuilder },
      { icon: GitBranch, title: "Advanced Logic", desc: "Built-in branching logic to manage complex participant flows seamlessly.", image: scriptingLogic },
    ],
  },
  {
    label: "AI Interview",
    items: [
      { icon: Sparkles, title: "Custom Configuration", desc: "Define specific objectives, language, and tone to tailor the AI moderator's persona.", image: aiInterviewConfig },
      { icon: MonitorPlay, title: "Media Targeting", desc: "Precise control over engagement types, requesting specific formats like video or voice notes.", image: aiInterviewMedia },
    ],
  },
  {
    label: "Diary Studies",
    items: [
      { icon: Calendar, title: "Automated Sequencing", desc: "Guide participants through a multi-day journey with a structured series of activities.", image: diaryStudySequencing },
      { icon: Route, title: "Smart Routing", desc: "Fine-tune flow with flexible controls to trigger next steps immediately or set custom delays.", image: diaryStudyRouting },
    ],
  },
];

const SlideProjectCreation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const tab = tabData[activeTab];

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setActiveImg(0);
  };

  const goPrev = () => setActiveImg((p) => (p === 0 ? tab.items.length - 1 : p - 1));
  const goNext = () => setActiveImg((p) => (p === tab.items.length - 1 ? 0 : p + 1));
  const showArrows = tab.items.length > 1;

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-4 md:px-16 lg:px-24 max-w-7xl mx-auto text-center overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <p className="slide-label mb-2">Project Creation & Scripting</p>
      </motion.div>
      <motion.div variants={fadeUp}>
        <h2 className="slide-subheadline mb-3 md:mb-4">
          AI-Powered<br />
          <span className="italic">Study Setup.</span>
        </h2>
      </motion.div>

      {/* Segmented toggle — scrollable on mobile */}
      <motion.div variants={fadeUp} className="mb-3 md:mb-4 w-full flex justify-center">
        <motion.div 
          className="inline-flex rounded-full border border-border/60 bg-muted/30 p-0.5 md:p-1.5 gap-0.5 md:gap-1"
          animate={{ boxShadow: ["0 0 0 0px rgba(0,0,0,0)", "0 0 0 3px rgba(0,0,0,0.06)", "0 0 0 0px rgba(0,0,0,0)"] }}
          transition={{ delay: 2, duration: 2, repeat: 2, ease: "easeInOut" }}
        >
          {tabData.map((t, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(i)}
              className="relative px-3 md:px-7 py-1.5 md:py-2.5 text-[11px] md:text-[15px] font-medium rounded-full transition-all duration-300 text-center whitespace-nowrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {i === activeTab && (
                <motion.div
                  layoutId="project-toggle"
                  className="absolute inset-0 rounded-full bg-foreground shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${
                i === activeTab ? "text-background" : "text-muted-foreground"
              }`}>
                {t.label}
              </span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeUp} className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease }}
          >
            {/* Feature cards */}
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-4 md:mb-5 max-w-[900px] mx-auto">
              {tab.items.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 flex-1 text-left cursor-pointer transition-opacity duration-300 ${
                    i === activeImg ? "opacity-100" : "opacity-40"
                  }`}
                  onClick={() => setActiveImg(i)}
                >
                  <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted/60 flex items-center justify-center">
                    <item.icon className="w-4 h-4 md:w-[18px] md:h-[18px] text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                    <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image with arrows */}
            <div className="flex items-center gap-3 md:gap-6 justify-center w-full">
              {showArrows && (
                <button
                  onClick={goPrev}
                  className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                </button>
              )}

              <div className="flex flex-col items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="relative w-full overflow-hidden rounded-xl border border-border shadow-lg bg-card max-h-[35vh] md:max-h-[50vh]" style={{ maxWidth: "900px" }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activeTab}-${activeImg}`}
                      src={tab.items[activeImg].image}
                      alt={`Screenshot ${activeImg + 1}`}
                      className="w-full h-full object-cover object-top block"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, ease }}
                    />
                  </AnimatePresence>
                </div>
                {showArrows && (
                  <div className="flex gap-2">
                    {tab.items.map((_, i) => (
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
                )}
              </div>

              {showArrows && (
                <button
                  onClick={goNext}
                  className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SlideProjectCreation;
