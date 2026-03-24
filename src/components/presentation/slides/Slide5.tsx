import { motion } from "framer-motion";
import { stagger, fadeUp } from "../animations";
import { Handshake, Database, Globe, Users, Server } from "lucide-react";
import InteractiveWorldMap from "@/components/presentation/InteractiveWorldMap";

const panelItems = [
  { icon: Handshake, title: "Panel Partnerships", desc: "We partner with leading providers like Cint, Prolific, Respondent IO, and more." },
  { icon: Database, title: "Massive Reach (Millions+)", desc: "Access millions of verified respondents across 50+ countries through our partner network." },
  { icon: Globe, title: "Cost-Effective Recruitment", desc: "We help with recruitment at significantly lower costs than traditional methods." },
];

const ownListItems = [
  { icon: Users, title: "Your Own Database", desc: "Upload and recruit directly from your own customer lists or user databases." },
  { icon: Server, title: "CRM/API Integration", desc: "Seamlessly connect your existing database for targeted research." },
];

const Slide5 = () => (
  <motion.div
    className="flex flex-col justify-center h-full px-4 md:px-16 lg:px-24 overflow-hidden"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <div className="max-w-6xl mx-auto w-full">
      <motion.div variants={fadeUp}>
        <p className="slide-label mb-1 md:mb-4">Recruitment</p>
      </motion.div>
      <motion.div variants={fadeUp}>
        <h2 className="slide-subheadline text-xl md:text-4xl mb-2 md:mb-8">
          Find your audience.<br />
          <span className="italic">Your way.</span>
        </h2>
      </motion.div>
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left column — two sections stacked */}
          <div>
            {/* Panel Partners */}
            <p className="slide-body font-medium text-foreground mb-2 md:mb-4 text-xs md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>Panel Partners</p>
            <div className="space-y-1.5 md:space-y-4">
              {panelItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <div className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-muted/60 flex items-center justify-center">
                    <item.icon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-border/40 my-4 md:my-6" />

            {/* Your Own Lists */}
            <p className="slide-body font-medium text-foreground mb-2 md:mb-4 text-xs md:text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your Own Lists</p>
            <div className="space-y-1.5 md:space-y-4">
              {ownListItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <div className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-muted/60 flex items-center justify-center">
                    <item.icon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 md:mt-8 flex gap-8">
              <div>
                <p className="text-2xl md:text-3xl font-serif text-foreground">50+</p>
                <p className="slide-body text-xs md:text-sm">Countries</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-serif text-foreground">1.8M+</p>
                <p className="slide-body text-xs md:text-sm">Panellists</p>
              </div>
            </div>
          </div>

          {/* Right column — map */}
          <div className="hidden lg:block rounded-xl overflow-hidden h-[380px] -mt-8 scale-[1.25] origin-center">
            <InteractiveWorldMap />
          </div>
          {/* Map hidden on mobile to fit content */}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default Slide5;
