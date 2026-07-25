import { useState, useRef, useCallback, useEffect } from "react";

const ENTER_DELAY = 180;
const EXIT_DELAY = 250;
const TRAJECTORY_SAMPLE = 4;

export function useSmartHover(_containerRef) {
  const [trail, setTrail] = useState([]);
  const enterTimer = useRef(null);
  const exitTimer = useRef(null);
  const [intent, setIntent] = useState(null);

  const clearTimers = useCallback(() => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    enterTimer.current = null;
    exitTimer.current = null;
  }, []);

  const handlePointerMove = useCallback((e) => {
    setTrail((prev) => {
      const next = [...prev, { x: e.clientX, y: e.clientY, t: Date.now() }];
      return next.length > TRAJECTORY_SAMPLE
        ? next.slice(-TRAJECTORY_SAMPLE)
        : next;
    });
  }, []);

  const headingToward = useCallback(
    (rect) => {
      if (trail.length < 2) return false;
      const prev = trail[trail.length - 2];
      const curr = trail[trail.length - 1];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const toCx = cx - curr.x;
      const toCy = cy - curr.y;
      const dot = dx * toCx + dy * toCy;
      return dot > 0;
    },
    [trail],
  );

  const onEnter = useCallback(
    (rect) => {
      clearTimers();
      if (rect && headingToward(rect)) {
        setIntent(true);
        return;
      }
      enterTimer.current = setTimeout(() => setIntent(true), ENTER_DELAY);
    },
    [clearTimers, headingToward],
  );

  const onExit = useCallback(() => {
    clearTimers();
    exitTimer.current = setTimeout(() => setIntent(false), EXIT_DELAY);
  }, [clearTimers]);

  const onImmediateEnter = useCallback(() => {
    clearTimers();
    setIntent(true);
  }, [clearTimers]);

  const onImmediateExit = useCallback(() => {
    clearTimers();
    setIntent(false);
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    intent,
    onEnter,
    onExit,
    onImmediateEnter,
    onImmediateExit,
    handlePointerMove,
    trail,
  };
}

export { ENTER_DELAY };