import type { Variants, Transition } from "framer-motion";

export const ease = [0.25, 0.46, 0.45, 0.94] as const;

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease } as Transition,
  },
};

export const fadeUpFast: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease } as Transition,
  },
};

export const slideTransition = {
  duration: 0.4,
  ease,
};

export const crossfade: Variants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
