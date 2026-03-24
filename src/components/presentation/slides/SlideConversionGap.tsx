import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, ease } from "../animations";

const traditionalData = {
  headline: "Where Traditional Research Loses You",
  steps: [
    { label: "Sent", value: 1000, percent: "100%" },
    { label: "Opened", value: 200, percent: "20%" },
    { label: "Clicked Link", value: 80, percent: "8%" },
    { label: "Completed", value: 30, percent: "3%" },
  ],
  stats: [
    { value: "$15–25", label: "Cost per Complete" },
    { value: "3–5 days", label: "Avg. Time to Complete" },
    { value: "Low", label: "Data Quality" },
  ],
  colors: ["hsl(15, 70%, 75%)", "hsl(15, 65%, 70%)", "hsl(15, 60%, 65%)", "hsl(15, 55%, 60%)"],
  statColor: "hsl(0, 65%, 50%)",
};

const yaziData = {
  headline: "Yazi Keeps the Funnel Full",
  steps: [
    { label: "Sent", value: 1000, percent: "100%" },
    { label: "Delivered", value: 980, percent: "98%" },
    { label: "Engaged", value: 670, percent: "67%" },
    { label: "Completed", value: 500, percent: "50%" },
  ],
  stats: [
    { value: "$0.50", label: "Cost per Complete" },
    { value: "< 2 hours", label: "Avg. Time to Complete" },
    { value: "High", label: "Data Quality" },
  ],
  colors: ["hsl(93, 18%, 52%)", "hsl(93, 20%, 47%)", "hsl(93, 22%, 42%)", "hsl(93, 24%, 37%)"],
  statColor: "hsl(93, 22%, 42%)",
};

const FunnelChart = ({ steps, colors }: { steps: typeof traditionalData.steps; colors: string[] }) => {
  const svgWidth = 600;
  const svgHeight = 370;
  const topY = 10;
  const segmentHeight = 80;
  const gap = 4;
  const centerX = svgWidth / 2;
  const maxHalfWidth = 180;
  const minHalfWidth = 30;

  const widths = steps.map((s) => {
    const ratio = s.value / 1000;
    return minHalfWidth + (maxHalfWidth - minHalfWidth) * ratio;
  });

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-[560px] md:max-w-[560px] max-w-[320px] mx-auto"
      style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.08))" }}
    >
      {steps.map((step, i) => {
        const y = topY + i * (segmentHeight + gap);
        const topHalf = widths[i];
        const bottomHalf = i < steps.length - 1 ? widths[i + 1] : minHalfWidth * 0.6;

        const points = [
          `${centerX - topHalf},${y}`,
          `${centerX + topHalf},${y}`,
          `${centerX + bottomHalf},${y + segmentHeight}`,
          `${centerX - bottomHalf},${y + segmentHeight}`,
        ].join(" ");

        const labelX = centerX - Math.max(topHalf, bottomHalf) - 8;

        return (
          <g key={i}>
            <motion.polygon
              points={points}
              fill={colors[i]}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.92, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
            />
            <text
              x={centerX}
              y={y + segmentHeight / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="15"
              fontWeight="700"
              fontFamily="'DM Sans', sans-serif"
            >
              {step.percent}
            </text>
            <text
              x={labelX}
              y={y + segmentHeight / 2 - 8}
              textAnchor="end"
              dominantBaseline="middle"
              fill="hsl(var(--foreground))"
              fontSize="13"
              fontWeight="600"
              fontFamily="'DM Sans', sans-serif"
            >
              {step.label}
            </text>
            <text
              x={labelX}
              y={y + segmentHeight / 2 + 10}
              textAnchor="end"
              dominantBaseline="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
              fontFamily="'DM Sans', sans-serif"
            >
              {step.value.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SlideConversionGap = () => {
  const [isYazi, setIsYazi] = useState(false);
  const data = isYazi ? yaziData : traditionalData;

  return (
    <motion.div
      className="flex flex-col justify-center items-center h-full px-4 md:px-16 lg:px-24 text-center overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-3xl w-full">
        <motion.div variants={fadeUp} className="text-center">
          <p className="slide-label mb-2 md:mb-4">The Conversion Gap</p>
        </motion.div>

        <motion.div variants={fadeUp} className="text-center">
          <h2 className="slide-subheadline mb-3 md:mb-6" style={{ minHeight: "2.4em" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={isYazi ? "yazi" : "trad"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease }}
                className="block"
              >
                {isYazi ? (
                  <>Yazi Keeps the Funnel <span className="italic">Full</span></>
                ) : (
                  <>Where Traditional Research <span className="italic">Loses You</span></>
                )}
              </motion.span>
            </AnimatePresence>
          </h2>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col items-center mb-4 md:mb-8">
          {/* Click hint — pill style for visibility */}
          <motion.div
            className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full border"
            style={{ backgroundColor: "hsla(145, 63%, 49%, 0.12)", borderColor: "hsla(145, 63%, 49%, 0.25)" }}
          >
            <motion.span
              className="text-[11px] md:text-xs font-semibold tracking-wide uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(145, 63%, 38%)" }}
            >
              ← Tap to compare →
            </motion.span>
          </motion.div>
          <div className="flex items-center justify-center gap-4">
          <span
            className="text-xs md:text-sm font-medium transition-colors duration-300 w-24 text-right"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: !isYazi ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
            }}
          >
            Traditional
          </span>
          <button
            onClick={() => setIsYazi(!isYazi)}
            className="relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none shrink-0"
            style={{ backgroundColor: isYazi ? "hsl(93, 22%, 42%)" : "hsl(15, 80%, 75%)" }}
          >
            <motion.div
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
              animate={{ x: isYazi ? 28 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span
            className="text-xs md:text-sm font-medium transition-colors duration-300 w-24 text-left"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: isYazi ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
            }}
          >
            Yazi
          </span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isYazi ? "yazi" : "trad"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease }}
            >
              <FunnelChart steps={data.steps} colors={data.colors} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isYazi ? "yazi-stats" : "trad-stats"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease }}
              className="flex justify-center gap-8 md:gap-16 mt-4 md:mt-8"
            >
              {data.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl md:text-3xl font-serif font-semibold" style={{ color: data.statColor }}>
                    {stat.value}
                  </p>
                  <p
                    className="text-xs md:text-base mt-1 md:mt-2"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(var(--muted-foreground))" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SlideConversionGap;
