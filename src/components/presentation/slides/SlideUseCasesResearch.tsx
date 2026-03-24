import { motion } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";

const useCases = [
  {
    icon: "📈",
    title: "Tracker Augmentation",
    desc: "Run parts of brand trackers and recurring studies via WhatsApp to dramatically reduce cost and turnaround time vs. traditional methods.",
    tag: "Trackers · Cost Savings",
    tagBg: "hsl(180, 40%, 92%)",
    tagColor: "hsl(180, 40%, 30%)",
    iconBg: "hsl(180, 40%, 92%)",
  },
  {
    icon: "🌍",
    title: "New Market & Brand Studies",
    desc: "Research consumer behaviour in new markets or for new brands/products. Reach respondents in local languages where traditional panels struggle.",
    tag: "Market Entry · Multilingual",
    tagBg: "hsl(93, 30%, 90%)",
    tagColor: "hsl(93, 22%, 38%)",
    iconBg: "hsl(93, 30%, 90%)",
  },
  {
    icon: "📱",
    title: "Product Testing via QR",
    desc: "QR code follow-ups after home delivery or in-store trial. Capture product experience data at the moment of use — not days later.",
    tag: "Product Testing · QR",
    tagBg: "hsl(350, 50%, 93%)",
    tagColor: "hsl(350, 50%, 40%)",
    iconBg: "hsl(350, 50%, 93%)",
  },
  {
    icon: "⚡",
    title: "WhatsApp Screeners & Recruitment",
    desc: "Faster incidence and recruitment via WhatsApp screeners — from panels or first-party data where consent allows. Cut recruitment time by 80%.",
    tag: "Recruitment · Speed",
    tagBg: "hsl(30, 80%, 92%)",
    tagColor: "hsl(20, 80%, 40%)",
    iconBg: "hsl(30, 80%, 92%)",
  },
];

const SlideUseCasesResearch = () => (
  <motion.div
    className="flex flex-col items-center justify-center h-full px-4 md:px-12 lg:px-20 text-center overflow-hidden"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeUp}>
      <p className="slide-label mb-2 md:mb-4">Tailored for BAT — Research</p>
    </motion.div>
    <motion.div variants={fadeUp}>
      <h2 className="slide-subheadline mb-2 md:mb-4">
        Research<br />
        <span className="italic">Trackers &amp; Ad-Hoc Studies</span>
      </h2>
    </motion.div>
    <motion.div variants={fadeUp}>
      <p className="slide-body text-sm md:text-base max-w-xl mb-6 md:mb-10">
        Reduce cost and turnaround on trackers, market entry studies, and product testing
      </p>
    </motion.div>

    <motion.div
      variants={fadeUp}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl w-full"
    >
      {useCases.map((uc, i) => (
        <motion.div
          key={i}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 text-left border border-border/40 hover:border-border/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
            style={{ backgroundColor: uc.iconBg }}
          >
            {uc.icon}
          </div>
          <h4
            className="text-sm md:text-[15px] font-semibold text-foreground mb-2 leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {uc.title}
          </h4>
          <p
            className="text-[11px] md:text-xs text-muted-foreground leading-relaxed mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {uc.desc}
          </p>
          <span
            className="inline-block px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-semibold"
            style={{ backgroundColor: uc.tagBg, color: uc.tagColor }}
          >
            {uc.tag}
          </span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

export default SlideUseCasesResearch;
