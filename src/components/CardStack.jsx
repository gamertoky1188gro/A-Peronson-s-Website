import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

function CardStackItem({ child, scrollYProgress, index, count, overlap }) {
  const progress = Math.max(0, Math.min(1, (index + 1) / count));
  const y = useTransform(
    scrollYProgress,
    [progress * 0.3, progress * 0.7],
    [index * overlap, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [progress * 0.2, progress * 0.5],
    [0.6, 1]
  );
  const scale = useTransform(
    scrollYProgress,
    [progress * 0.2, progress * 0.5],
    [0.92, 1]
  );
  return (
    <motion.div
      style={{ y, opacity, scale, zIndex: count - index }}
      className="relative"
    >
      {child}
    </motion.div>
  );
}

export default function CardStack({
  children,
  className = "",
  stackDistance = 80,
  overlap = 40,
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const count = Array.isArray(children) ? children.length : 1;

  return (
    <div ref={ref} className={"relative " + className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <CardStackItem
              key={i}
              child={child}
              scrollYProgress={scrollYProgress}
              index={i}
              count={count}
              overlap={overlap}
            />
          ))
        : children}
    </div>
  );
}
