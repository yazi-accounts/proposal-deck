import { useState } from "react";
import { Menu, X, Download } from "lucide-react";

const slideNames = [
  "Introduction",
  "The Conversion Gap",
  "Methodologies",
  "Project Creation & Scripting",
  "Multilingual",
  "Recruitment",
  "Engagement",
  "Security",
  "Reporting & Analytics",
  "Clients",
  "Book a Demo",
];

interface SlideMenuProps {
  current: number;
  total: number;
  onGoTo: (index: number) => void;
  onPrint?: () => void;
}

const SlideMenu = ({ current, total, onGoTo, onPrint }: SlideMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top-right navigation pill */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2 md:gap-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-3 md:px-4 h-[38px] md:h-[42px]" style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="w-1 h-5 rounded-full bg-olive" />
        <div className="flex flex-col leading-tight">
          <span
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {current + 1} / {total}
          </span>
          <span
            className="hidden md:block text-sm font-medium text-foreground"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {slideNames[current] || `Slide ${current + 1}`}
          </span>
        </div>
        {onPrint && (
          <button
            onClick={onPrint}
            className="ml-0.5 p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Download as PDF"
            title="Save as PDF"
          >
            <Download size={16} />
          </button>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="ml-0.5 md:ml-1 p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label="Open slide menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div
            className="absolute top-16 right-5 w-64 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg py-2 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {slideNames.slice(0, total).map((name, i) => (
              <button
                key={i}
                onClick={() => {
                  onGoTo(i);
                  setOpen(false);
                }}
                className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors text-sm ${
                  i === current
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === current ? "bg-olive" : "bg-border"}`} />
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SlideMenu;
