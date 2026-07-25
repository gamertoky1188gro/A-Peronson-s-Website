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
	warn: (..._args) => {
		if (IS_DEV) {
		}
	},
	/**
	 * Logs an error message.
	 * @param {...any} args - Arguments to log.
	 * @returns {void}
	 */
	error: (..._args) => {
		if (IS_DEV) {
		}
	},
	/**
	 * Logs an info message.
	 * @param {...any} args - Arguments to log.
	 * @returns {void}
	 */
	info: (..._args) => {
		if (IS_DEV) {
		}
	},
	/**
	 * Logs a debug message.
	 * @param {...any} args - Arguments to log.
	 * @returns {void}
	 */
	log: (..._args) => {
		if (IS_DEV) {
		}
	},
};
