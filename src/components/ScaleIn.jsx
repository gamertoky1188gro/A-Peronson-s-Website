import { motion, useReducedMotion } from "framer-motion";

export default function ScaleIn({
  children,
  className = "",
  as = "div",
  delay = 0,
  duration = 0.5,
  scale = 0.92,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
