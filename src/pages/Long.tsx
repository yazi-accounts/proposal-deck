import { ReactNode } from "react";
import Presentation, { defaultSlides } from "@/components/presentation/Presentation";
import SlideCompletionWindow from "@/components/presentation/slides/SlideCompletionWindow";

// The long deck (deck.askyazi.com/long) starts as an exact copy of the main
// deck at "/". Add the longer-version slides to this array — the main deck is
// unaffected because it renders `defaultSlides` directly.
//
// Order: defaultSlides[0] = intro, [1] = The Conversion Gap. The completion-
// window slide extends that argument, so it sits right after the gap.
const longSlides: ReactNode[] = [
  ...defaultSlides.slice(0, 2),
  <SlideCompletionWindow />,
  ...defaultSlides.slice(2),
];

const Long = () => <Presentation slides={longSlides} />;

export default Long;
