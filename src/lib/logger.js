const IS_DEV = import.meta.env.DEV;

export const logger = {
  warn: (...args) => {
    if (IS_DEV) console.warn(...args);
  },
  error: (...args) => {
    if (IS_DEV) console.error(...args);
  },
  info: (...args) => {
    if (IS_DEV) console.info(...args);
  },
  log: (...args) => {
    if (IS_DEV) console.log(...args);
  },
};
