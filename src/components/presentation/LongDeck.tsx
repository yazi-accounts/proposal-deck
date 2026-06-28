import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { slideTransition } from "./animations";
import ProgressIndicator from "./ProgressIndicator";
import DemoButton from "./DemoButton";
import { presentationSlides as slides } from "./slideList";
import sbDeckHtml from "./standard-bank-deck.html?raw";

// The Standard Bank intro deck is a self-contained 16-slide HTML deck, embedded
// verbatim in an iframe so its styles/scripts stay fully isolated. Its nav script
// is rewired to forward arrow keys to this parent controller, so the SB slides and
// the existing presentation slides read as one continuous deck.
const SB_COUNT = 16;

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, y: direction > 0 ? 40 : -40 }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: direction > 0 ? -40 : 40 }),
};

const LongDeck = () => {
  const total = SB_COUNT + slides.length;
  const { currentSlide, direction, next, prev, goTo } = useSlideNavigation(total);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentRef = useRef(currentSlide);
  currentRef.current = currentSlide;

  const inIntro = currentSlide < SB_COUNT;

  const postToIframe = useCallback((n: number) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "sbgoto", n }, "*");
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("presentation-mode");
    return () => { document.documentElement.classList.remove("presentation-mode"); };
  }, []);

  // Keep the embedded SB deck in sync with the shared index while in the intro range.
  useEffect(() => {
    if (currentSlide < SB_COUNT) postToIframe(currentSlide);
  }, [currentSlide, postToIframe]);

  // Bridge: the iframe forwards key presses (and a ready signal) to this controller.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; dir?: number; to?: number | "end" } | null;
      if (!d || typeof d.type !== "string") return;
      if (d.type === "sbready") {
        postToIframe(currentRef.current < SB_COUNT ? currentRef.current : 0);
      } else if (d.type === "sbnav") {
        if (d.to === 0) goTo(0);
        else if (d.to === "end") goTo(total - 1);
        else if (d.dir && d.dir > 0) next();
        else if (d.dir && d.dir < 0) prev();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [next, prev, goTo, total, postToIframe]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background select-none">
      {/* Standard Bank intro deck — embedded verbatim, always mounted to avoid reloads */}
      <iframe
        ref={iframeRef}
        title="Yazi for Standard Bank"
        srcDoc={sbDeckHtml}
        className="absolute inset-0 w-full h-full border-0 transition-opacity duration-300"
        style={{ opacity: inIntro ? 1 : 0, pointerEvents: inIntro ? "auto" : "none", zIndex: inIntro ? 20 : 0 }}
      />

      {/* Existing presentation slides */}
      {!inIntro && (
        <AnimatePresence mode="wait" custom={direction === "forward" ? 1 : -1}>
          <motion.div
            key={currentSlide}
            custom={direction === "forward" ? 1 : -1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
          >
            {slides[currentSlide - SB_COUNT]}
          </motion.div>
        </AnimatePresence>
      )}

      <DemoButton onGoToDemo={() => goTo(total - 1)} />
      <ProgressIndicator total={total} current={currentSlide} onGoTo={goTo} />
    </div>
  );
};

export default LongDeck;
