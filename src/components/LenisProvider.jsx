import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

export default function LenisProvider({ children }) {
  const reduceMotion = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        duration: reduceMotion ? 0 : 1.2,
        lerp: reduceMotion ? 1 : 0.1,
        smoothWheel: !reduceMotion,
        syncTouch: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
        autoRaf: true,
        prevent: (node) => {
          if (node.hasAttribute?.("data-lenis-prevent")) return true;
          return false;
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
