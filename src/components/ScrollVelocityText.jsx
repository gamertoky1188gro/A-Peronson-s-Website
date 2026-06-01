import { motion, useTransform, useReducedMotion } from "framer-motion";
import useScrollVelocity from "../hooks/useScrollVelocity";

export default function ScrollVelocityText({
  children,
  className = "",
  as = "span",
  speedFactor = 0.5,
  maxTranslate = 30,
}) {
  const reduceMotion = useReducedMotion();
  const velocity = useScrollVelocity();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const translateX = useTransform(
    velocity,
    [-2000, 0, 2000],
    [-maxTranslate, 0, maxTranslate]
  );

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={"inline-block " + className}
      style={{ x: translateX }}
    >
      {children}
    </MotionTag>
  );
}
