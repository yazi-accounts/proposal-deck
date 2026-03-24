import { motion } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";

const steps = [
  { label: "Problem", text: "Uber needed to understand rider dissatisfaction across 12 markets — in weeks, not months." },
  { label: "Method", text: "AI-moderated interviews via WhatsApp in 8 languages, with adaptive probing." },
  { label: "Sample", text: "2,400 riders across 12 countries, recruited from Uber's own customer base." },
  { label: "Insight", text: "Pricing perception varied dramatically by city — not country. Local context mattered more than macro trends." },
  { label: "Outcome", text: "Uber restructured pricing communication for 6 priority cities, improving NPS by 14 points." },
];

const Slide10 = () => (
  <motion.div
    className="flex flex-col justify-center h-full px-4 md:px-16 lg:px-24 max-w-5xl mx-auto"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeUp}>
      <p className="slide-label mb-2 md:mb-4">Case Study</p>
    </motion.div>
    <motion.div variants={fadeUp}>
      <h2 className="slide-subheadline mb-6 md:mb-10">
        From insight to<br />
        <span className="italic">impact.</span>
      </h2>
    </motion.div>
    <motion.div variants={fadeUp}>
      <div className="space-y-4 md:space-y-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex gap-4 md:gap-6 items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.06, ease }}
          >
            <span className="slide-label shrink-0 w-16 md:w-20 pt-1 text-[10px] md:text-xs">{step.label}</span>
            <div className="border-l border-border pl-4 md:pl-6">
              <p className="slide-body text-foreground text-sm md:text-base">{step.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default Slide10;
