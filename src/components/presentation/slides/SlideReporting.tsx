import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import { ChevronLeft, ChevronRight, MessageSquare, Image, UserCheck, BarChart3, Table2 } from "lucide-react";
import qualTranscripts from "@/assets/qual-transcripts.png";
import qualMediaGallery from "@/assets/qual-media-gallery.png";
import quantGraphData from "@/assets/quant-graph-data.png";
import quantTableData from "@/assets/quant-table-data.png";
import quantCrossTab from "@/assets/quant-cross-tab.png";

const sections = [
  {
    key: "qual",
    label: "Qualitative",
    images: [qualTranscripts, qualMediaGallery],
    features: [
      { icon: MessageSquare, title: "Immersive Chat View", desc: "Review individual transcripts, play voice/video media, and view image meta-text." },
      { icon: Image, title: "Media Gallery", desc: "Browse and download all rich media responses in a centralized grid." },
      { icon: UserCheck, title: "Agent Takeover", desc: "Step in as a human moderator to engage directly with participants in real-time." },
    ],
  },
  {
    key: "quant",
    label: "Quantitative",
    images: [quantGraphData, quantTableData, quantCrossTab],
    features: [
      { icon: BarChart3, title: "Visual Analytics", desc: "Interactive bar charts with filtering and cross-tab capabilities; exportable to PowerPoint." },
      { icon: Table2, title: "Data Management", desc: "Structured table views with options to enrich data and sync directly to Excel or Google Sheets." },
    ],
  },
];

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [activeImg, setActiveImg] = useState(0);
  if (images.length === 0) return null;
  const showArrows = images.length > 1;
  const goPrev = () => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1));
  const goNext = () => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div className="flex items-center gap-3 md:gap-6 justify-center w-full">
      {showArrows && (
        <button onClick={goPrev} className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors" aria-label="Previous image">
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>
      )}
      <div className="flex flex-col items-center gap-2 md:gap-3 flex-1 min-w-0">
        <div className="relative w-full overflow-hidden rounded-xl border border-border shadow-lg bg-card max-h-[35vh] md:max-h-[50vh]" style={{ maxWidth: "900px" }}>
          <AnimatePresence mode="wait">
            <motion.img key={activeImg} src={images[activeImg]} alt={`Screenshot ${activeImg + 1}`} className="w-full h-full object-cover object-top block" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease }} />
          </AnimatePresence>
        </div>
        {showArrows && (
          <div className="flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === activeImg ? "bg-foreground scale-110" : "bg-border hover:bg-muted-foreground"}`} aria-label={`View image ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
      {showArrows && (
        <button onClick={goNext} className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors" aria-label="Next image">
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>
      )}
    </div>
  );
};

const SlideReporting = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const section = sections[activeIdx];

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-4 md:px-16 lg:px-24 max-w-7xl mx-auto text-center overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <p className="slide-label mb-2">Reporting & Analytics</p>
      </motion.div>
      <motion.div variants={fadeUp}>
        <h2 className="slide-subheadline mb-3 md:mb-5">
          Deep Qualitative &<br />
          <span className="italic">Quantitative Insights.</span>
        </h2>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-3 md:mb-4">
        <motion.div 
          className="inline-flex rounded-full border border-border/60 bg-muted/30 p-1 md:p-1.5 gap-1"
          animate={{ boxShadow: ["0 0 0 0px rgba(0,0,0,0)", "0 0 0 3px rgba(0,0,0,0.06)", "0 0 0 0px rgba(0,0,0,0)"] }}
          transition={{ delay: 2, duration: 2, repeat: 2, ease: "easeInOut" }}
        >
          {sections.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActiveIdx(i)}
              className="relative px-4 md:px-7 py-2 md:py-2.5 text-[12px] md:text-[15px] font-medium rounded-full transition-all duration-300 text-center whitespace-nowrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {i === activeIdx && (
                <motion.div layoutId="reporting-toggle" className="absolute inset-0 rounded-full bg-foreground shadow-md" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${i === activeIdx ? "text-background" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} className="w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeIdx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}>
            {/* Feature cards — stack on mobile */}
            <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-8 mb-4 md:mb-5 max-w-[900px] mx-auto">
              {section.features.map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3 flex-1 text-left">
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
            <ImageCarousel images={section.images} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SlideReporting;
