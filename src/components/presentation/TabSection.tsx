import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "./animations";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabSectionProps {
  tabs: Tab[];
  layoutId?: string;
}

const TabSection = ({ tabs, layoutId = "tab-toggle" }: TabSectionProps) => {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex justify-start mb-8">
        <div className="inline-flex rounded-full border border-border/60 bg-muted/30 p-1 md:p-1.5 gap-0.5 md:gap-1 max-w-full">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative px-4 md:px-7 py-2 md:py-2.5 text-xs md:text-[15px] font-medium rounded-full transition-all duration-300 text-center whitespace-nowrap min-w-[90px] md:min-w-[140px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {i === active && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-foreground shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${
                i === active ? "text-background" : "text-muted-foreground"
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease }}
        >
          {tabs[active].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabSection;
