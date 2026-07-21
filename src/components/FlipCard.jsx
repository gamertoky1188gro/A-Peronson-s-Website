import { motion, useReducedMotion } from "framer-motion";
import PropTypes from "prop-types";

FlipCard.propTypes = {
  front: PropTypes.node.isRequired,
  back: PropTypes.node.isRequired,
  className: PropTypes.string,
  flipOn: PropTypes.oneOf(["hover", "click"]),
  isFlipped: PropTypes.bool,
  onFlip: PropTypes.func,
};

export default function FlipCard({
  front,
  back,
  className = "",
  flipOn = "hover",
  isFlipped: controlledFlip,
  onFlip,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{front}</div>;
  }

  const isControlled = controlledFlip !== undefined;

  return (
    <div
      className={`group perspective-[1000px] ${className}`}
      onClick={
        !isControlled && flipOn === "click" ? () => onFlip?.() : undefined
      }
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: isControlled ? (controlledFlip ? 180 : 0) : undefined,
        }}
        whileHover={
          !isControlled && flipOn === "hover" ? { rotateY: 180 } : undefined
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
