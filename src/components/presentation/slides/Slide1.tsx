import { motion } from "framer-motion";
import { stagger, fadeUp } from "../animations";
import yaziLogo from "@/assets/yazi-logo-circle.png";

const Slide1 = () =>
<motion.div
  className="flex flex-col items-center justify-center h-full px-4 md:px-8 text-center relative"
  variants={stagger}
  initial="hidden"
  animate="visible">
  
    {/* Co-branded logos */}
    <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6 md:mb-8">
      <img src={yaziLogo} alt="Yazi" className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
      <span className="text-2xl md:text-3xl text-muted-foreground/40 font-light">×</span>
      <span
        className="text-2xl md:text-3xl font-bold tracking-wide"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(211, 75%, 30%)" }}
      >
        BAT
      </span>
    </motion.div>
    <motion.div variants={fadeUp}>
      <h1 className="slide-headline mb-6 md:mb-8">
        AI-Powered Consumer<br />
        Research for <span className="italic">BAT</span>
      </h1>
    </motion.div>
    <motion.div variants={fadeUp}>
      <p className="slide-body max-w-xl text-base md:text-lg">
        Understand your consumers across Vuse, Velo, glo, and<br className="hidden md:block" />
        combustibles — through WhatsApp conversations at scale
      </p>
    </motion.div>

    {/* Swipe hint at bottom */}
    <motion.div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8, duration: 0.8 }}>
    
      <motion.p
      className="text-[11px] md:text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
      
        Swipe to explore
      </motion.p>
      <motion.div
      className="flex flex-col items-center"
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
      
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center pt-1.5">
          <motion.div
          className="w-1 h-1.5 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        
        </div>
      </motion.div>
    </motion.div>
  </motion.div>;


export default Slide1;