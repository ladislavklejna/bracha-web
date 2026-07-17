import { useEffect, useState } from "react";

// Measures the sticky navbar's real rendered height (".navi") so react-scroll
// offsets can be computed from actual layout instead of hand-tuned magic
// numbers per breakpoint. Only re-measures on resize, not on mobile menu
// open/close, so it always reflects the collapsed bar height — which is
// what matters once the smooth-scroll animation finishes.
export function useNavHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector(".navi");
      if (nav) setHeight(nav.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    // Fonts/images can still be settling right after mount — measure again shortly after.
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  return height;
}
