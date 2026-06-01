import { useMotionValue, useScroll } from "framer-motion";
import { useEffect } from "react";

export default function useScrollVelocity() {
  const { scrollY } = useScroll();
  const velocity = useMotionValue(0);
  const lastY = useMotionValue(0);
  const lastTime = useMotionValue(Date.now());

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const dt = Math.max(16, now - lastTime.get());
      const dy = scrollY.get() - lastY.get();
      const v = (dy / dt) * 1000;
      velocity.set(v);
      lastY.set(scrollY.get());
      lastTime.set(now);
    };

    const unsubscribe = scrollY.on("change", update);
    return () => unsubscribe();
  }, [scrollY, velocity, lastY, lastTime]);

  return velocity;
}
