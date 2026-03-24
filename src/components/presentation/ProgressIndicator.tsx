import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressIndicatorProps {
  total: number;
  current: number;
  onGoTo: (index: number) => void;
}

const ProgressIndicator = ({ total, current, onGoTo }: ProgressIndicatorProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-3 py-2 shadow-sm">
      <button
        onClick={() => onGoTo(current - 1)}
        disabled={current === 0}
        className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className="group p-0.5"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 h-1.5 bg-foreground"
                  : "w-1.5 h-1.5 bg-foreground/20 group-hover:bg-foreground/40"
              }`}
            />
          </button>
        ))}
      </div>
      <button
        onClick={() => onGoTo(current + 1)}
        disabled={current === total - 1}
        className="p-1 rounded-full hover:bg-muted transition-colors disabled:opacity-20"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default ProgressIndicator;
