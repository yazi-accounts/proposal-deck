import { ReactNode, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { slideTransition, ease } from "./animations";
import ProgressIndicator from "./ProgressIndicator";
import SlideMenu from "./SlideMenu";
import DemoButton from "./DemoButton";
import Slide1 from "./slides/Slide1";
import SlideConversionGap from "./slides/SlideConversionGap";
import SlideUseCasesFeedback from "./slides/SlideUseCasesFeedback";
import SlideUseCasesResearch from "./slides/SlideUseCasesResearch";
import SlideHowItWorks from "./slides/SlideHowItWorks";
import Slide2 from "./slides/Slide2";
import SlideProjectCreation from "./slides/SlideProjectCreation";
import Slide3 from "./slides/Slide3";
import Slide5 from "./slides/Slide5";
import Slide8 from "./slides/Slide8";
import Slide7 from "./slides/Slide7";
import Slide9 from "./slides/Slide9";
import SlideReporting from "./slides/SlideReporting";
import Slide11 from "./slides/Slide11";

const slides: ReactNode[] = [
  <Slide1 />,                 // 1. Introduction (BAT co-branded)
  <SlideConversionGap />,     // 2. The Conversion Gap
  <SlideUseCasesFeedback />,  // 3. Customer Feedback Use Cases (BAT)
  <SlideUseCasesResearch />,  // 4. Research Use Cases (BAT)
  <SlideHowItWorks />,        // 5. How It Works — Flow Infographic (BAT)
  <Slide2 />,                 // 6. Methodologies
  <SlideProjectCreation />,   // 7. Project Creation & Scripting
  <Slide3 />,                 // 8. Multilingual
  <Slide5 />,                 // 9. Panel Coverage
  <Slide8 />,                 // 10. Engagement (broadcast/automation)
  <Slide7 />,                 // 11. Security
  <SlideReporting />,         // 12. Reporting & Analytics
  <Slide9 />,                 // 13. Clients
  <Slide11 />,                // 14. Book a Demo
];

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
