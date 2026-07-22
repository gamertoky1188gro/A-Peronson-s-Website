const IS_DEV = import.meta.env.DEV;

/**
 * Application logger. Only emits in development mode.
 * @namespace logger
 */
export const logger = {
  /**
   * Logs a warning message.
   * @param {...any} args - Arguments to log.
   * @returns {void}
   */
  warn: (...args) => {
    if (IS_DEV) console.warn(...args);
  },
  /**
   * Logs an error message.
   * @param {...any} args - Arguments to log.
   * @returns {void}
   */
  error: (...args) => {
    if (IS_DEV) console.error(...args);
  },
  /**
   * Logs an info message.
   * @param {...any} args - Arguments to log.
   * @returns {void}
   */
  info: (...args) => {
    if (IS_DEV) console.info(...args);
  },
  /**
   * Logs a debug message.
   * @param {...any} args - Arguments to log.
   * @returns {void}
   */
  log: (...args) => {
    if (IS_DEV) console.log(...args);
  },
};
