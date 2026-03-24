import { useState, useEffect, useCallback, useRef } from "react";

export function useSlideNavigation(totalSlides: number) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide || index < 0 || index >= totalSlides) return;
      setDirection(index > currentSlide ? "forward" : "backward");
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [currentSlide, totalSlides, isAnimating]
  );

  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);
  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [next, prev]);

  return { currentSlide, direction, isAnimating, next, prev, goTo, totalSlides };
}
