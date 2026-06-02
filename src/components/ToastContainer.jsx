import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const ToastContext = createContext(null);

let toastId = 0;

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});
  const reduceMotion = useReducedMotion();

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const addToast = useCallback(
    (message, { type = "info", duration = 4000 } = {}) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      timersRef.current[id] = setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast],
  );

  const toast = useCallback(
    (message, opts) => addToast(message, opts),
    [addToast],
  );
  toast.success = useCallback(
    (msg, opts) => addToast(msg, { ...opts, type: "success" }),
    [addToast],
  );
  toast.error = useCallback(
    (msg, opts) => addToast(msg, { ...opts, type: "error" }),
    [addToast],
  );
  toast.info = useCallback(
    (msg, opts) => addToast(msg, { ...opts, type: "info" }),
    [addToast],
  );

  const typeStyles = {
    success:
      "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20",
    error: "bg-red-600 text-white shadow-lg shadow-red-500/20",
    info: "bg-sky-600 text-white shadow-lg shadow-sky-500/20",
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              className={`pointer-events-auto rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl ${typeStyles[t.type] || typeStyles.info}`}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => removeToast(t.id)}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
