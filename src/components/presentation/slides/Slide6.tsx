import { motion } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";

const features = [
  "Broadcast messaging",
  "Live response + completion tracking",
  "Automated nudges",
  "Drop-off visibility",
];

const Slide6 = () => (
  <motion.div
    className="flex flex-col justify-center h-full px-4 md:px-16 lg:px-24 max-w-5xl mx-auto"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeUp}>
      <p className="slide-label mb-2 md:mb-4">Engagement</p>
    </motion.div>
    <motion.div variants={fadeUp}>
      <h2 className="slide-subheadline mb-6 md:mb-12">
        Send invites at scale —<br />
        <span className="italic">with real stats.</span>
      </h2>
    </motion.div>
    <motion.div variants={fadeUp}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="border border-border rounded-xl p-3 md:p-5 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 + i * 0.1, ease }}
          >
            <div className="w-2 h-2 rounded-full bg-primary mb-2 md:mb-4" />
            <p className="slide-body text-xs md:text-sm text-foreground font-medium">{f}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default Slide6;
