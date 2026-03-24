import { Sparkles } from "lucide-react";

interface DemoButtonProps {
  onGoToDemo: () => void;
}

const DemoButton = ({ onGoToDemo }: DemoButtonProps) => {
  return (
    <button
      onClick={onGoToDemo}
      className="fixed top-5 left-5 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border rounded-full px-3 md:px-4 h-[38px] md:h-[42px] hover:bg-muted/80 transition-all duration-200 group"
      style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <Sparkles size={16} className="text-primary" />
      <span
        className="text-sm font-medium text-foreground"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Book a Demo
      </span>
    </button>
  );
};

export default DemoButton;
