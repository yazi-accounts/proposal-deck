import { motion } from "framer-motion";
import { stagger, fadeUp } from "../animations";
import { Zap, CalendarClock, BellRing, Repeat2 } from "lucide-react";
import completionCurve from "@/assets/when-customers-finish.svg";

const points = [
  {
    icon: Zap,
    title: "As fast as a browser",
    desc: "The WhatsApp click-through is instant. Questions render and submit as quickly as any web survey — there is no speed trade-off.",
  },
  {
    icon: CalendarClock,
    title: "Open for the whole fieldwork window",
    desc: "Respondents can reach their survey for as long as the study is in field. People finish across hours, days and weeks — not just minutes — which lifts engagement and completion, especially on longer questionnaires.",
  },
  {
    icon: BellRing,
    title: "Reminders that actually land",
    desc: "A WhatsApp nudge brings people back. An email asking them to “please finish your survey” gets ignored — or resented.",
  },
  {
    icon: Repeat2,
    title: "Second sessions still count",
    desc: "On the web, a half-finished tab buried on someone’s phone three days later is a write-off. On WhatsApp they pick up exactly where they left off.",
  },
];

const SlideCompletionWindow = () => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 h-full px-4 md:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Left — the argument */}
      <div className="w-full md:w-[44%] text-left shrink-0">
        <motion.p variants={fadeUp} className="slide-label mb-2 md:mb-3">
          Questions, Drop-off &amp; When This Works
        </motion.p>

        <motion.h2 variants={fadeUp} className="slide-subheadline mb-3 md:mb-4">
          How many questions?<br />
          <span className="italic">As many as you need.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 md:mb-7 max-w-[42ch]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Length kills completion on a one-shot web survey. On WhatsApp the thread stays
          open, so people answer in their own time — the same number of questions, or more.
        </motion.p>

        <div className="flex flex-col gap-3 md:gap-4">
          {points.map((p) => (
            <motion.div key={p.title} variants={fadeUp} className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted/60 flex items-center justify-center">
                <p.icon className="w-4 h-4 md:w-[18px] md:h-[18px] text-muted-foreground" />
              </div>
              <div>
                <p
                  className="text-[13px] md:text-[15px] font-semibold text-foreground leading-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {p.title}
                </p>
                <p
                  className="text-[11px] md:text-[13px] text-muted-foreground mt-0.5 leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right — the completion curve */}
      <motion.div variants={fadeUp} className="w-full md:w-[56%] flex justify-center">
        <img
          src={completionCurve}
          alt="Cumulative completion across 15,758 WhatsApp customer surveys: ~88% by 1 hour, ~92% by 1 day, ~97% by 1 week, all complete by 3 months."
          className="w-full max-w-[560px] md:max-h-[86vh] object-contain rounded-2xl"
          style={{ filter: "drop-shadow(0 12px 40px rgba(17,34,51,0.12))" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SlideCompletionWindow;
