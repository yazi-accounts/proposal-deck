import { motion } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";
import { ShieldCheck, Lock, Server, Users } from "lucide-react";

const items = [
  { title: "GDPR-aligned", desc: "Compliant data handling", icon: ShieldCheck },
  { title: "Encryption", desc: "In transit & at rest", icon: Lock },
  { title: "Secure hosting", desc: "Enterprise-grade infrastructure", icon: Server },
  { title: "Access controls", desc: "Role-based permissions", icon: Users },
];

const Slide7 = () => (
  <motion.div
    className="flex flex-col justify-center items-center h-full px-4 md:px-16 lg:px-24 max-w-5xl mx-auto text-center"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeUp}>
      <p className="slide-label mb-2 md:mb-4">Security</p>
    </motion.div>
    <motion.div variants={fadeUp}>
      <h2 className="slide-subheadline mb-8 md:mb-16">
        Enterprise<br />
        <span className="italic">ready.</span>
      </h2>
    </motion.div>
    <motion.div variants={fadeUp}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-3xl text-left">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className="flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-xl transition-all duration-300 hover:bg-foreground/[0.03] hover:scale-[1.02] hover:shadow-sm cursor-default"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.1, ease }}
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-olive" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-foreground font-medium text-base md:text-lg">{item.title}</p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  </motion.div>
);

export default Slide7;
