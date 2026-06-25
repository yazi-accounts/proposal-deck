import { ReactNode } from "react";
import Presentation, { defaultSlides } from "@/components/presentation/Presentation";

// The long deck (deck.askyazi.com/long) starts as an exact copy of the main
// deck at "/". Add the longer-version slides to this array — the main deck is
// unaffected because it renders `defaultSlides` directly.
const longSlides: ReactNode[] = [
  ...defaultSlides,
  // Additions for the long deck go here.
];

const Long = () => <Presentation slides={longSlides} />;

export default Long;
