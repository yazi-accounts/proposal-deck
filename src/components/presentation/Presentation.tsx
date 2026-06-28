import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { slideTransition, ease } from "./animations";
import ProgressIndicator from "./ProgressIndicator";
import SlideMenu from "./SlideMenu";
import DemoButton from "./DemoButton";
import { presentationSlides as slides } from "./slideList";

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -40 : 40,
  }),
};

const Presentation = () => {
  const { currentSlide, direction, goTo } = useSlideNavigation(slides.length);

  // Lock scrolling on the presentation page
  useEffect(() => {
    document.documentElement.classList.add("presentation-mode");
    return () => { document.documentElement.classList.remove("presentation-mode"); };
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-background select-none print-hide">
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
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
        <DemoButton onGoToDemo={() => goTo(slides.length - 1)} />
        <SlideMenu current={currentSlide} total={slides.length} onGoTo={goTo} onPrint={handlePrint} />
        <ProgressIndicator total={slides.length} current={currentSlide} onGoTo={goTo} />
      </div>

      {/* Hidden print container — rendered for @media print */}
      <div className="print-slides hidden">
        {slides.map((slide, i) => (
          <div key={i} className="print-slide-page">
            {slide}
          </div>
        ))}
      </div>
    </>
  );
};

export default Presentation;
