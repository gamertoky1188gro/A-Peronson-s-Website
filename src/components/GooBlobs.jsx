import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const COLORS = [
  "rgba(14,165,233,0.25)",
  "rgba(99,102,241,0.20)",
  "rgba(6,182,212,0.20)",
];

function createBlobs(count, size, colors) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    cx: 30 + (i * 70) / count + Math.random() * 10,
    cy: 20 + Math.random() * 40,
    r: size * (0.08 + Math.random() * 0.06),
    color: colors[i % colors.length],
    dx: -8 + Math.random() * 16,
    dy: -8 + Math.random() * 16,
    dur: 6 + Math.random() * 4,
  }));
}

export default function GooBlobs({
  className = "",
  count = 4,
  size = 180,
  colors = COLORS,
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });
  const [blobs] = useState(() => createBlobs(count, size, colors));

  if (reduceMotion) return null;

  const shouldAnimate = inView;

  return (
    <div ref={ref} className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
        <g filter="url(#goo)">
          {blobs.map((b) => (
            <motion.circle
              key={b.id}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill={b.color}
              animate={shouldAnimate ? {
                cx: [b.cx, b.cx + b.dx, b.cx - b.dx, b.cx],
                cy: [b.cy, b.cy + b.dy, b.cy - b.dy, b.cy],
                r: [b.r, b.r * 1.15, b.r * 0.9, b.r],
              } : undefined}
              transition={shouldAnimate ? {
                duration: b.dur,
                repeat: Infinity,
                ease: "easeInOut",
              } : undefined}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
