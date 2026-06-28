import { ReactNode } from "react";
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

export const presentationSlides: ReactNode[] = [
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
