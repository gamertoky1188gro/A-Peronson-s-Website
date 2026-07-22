import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 28, mass: 0.6 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const slideRightVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/**
 * Renders an animated modal component.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Function} props.onClose - Function to call when the modal should close.
 * @param {React.ReactNode} props.children - The content of the modal.
 * @param {string} [props.className=""] - Additional CSS class names.
 * @param {'center'|'right'} [props.variant="center"] - The variant of the modal.
 * @param {boolean} [props.overlay=true] - Whether to show the overlay.
 * @returns {JSX.Element|null} The rendered animated modal component.
 */
export default function AnimatedModal({
  open,
  onClose,
  children,
  className = "",
  variant = "center",
  overlay = true,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {overlay && (
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        )}
        <div className={`relative ${className}`}>{children}</div>
      </div>
    );
  }

  const contentVariants =
    variant === "right" ? slideRightVariants : modalVariants;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {overlay && (
            <motion.div
              className="absolute inset-0 bg-black/50"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            />
          )}
          <motion.div
            className={`relative ${className}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
