import chalk from "chalk";

function _formatValue(value, indent = 0) {
	const prefix = "  ".repeat(indent);

	if (value === null) {
		return chalk.gray("null");
	}
	if (value === undefined) {
		return chalk.gray("undefined");
	}
	if (typeof value === "boolean") {
		return value ? chalk.green("true") : chalk.red("false");
	}
	if (typeof value === "number") {
		if (Number.isInteger(value)) {
			return chalk.cyan(String(value));
		}
		return chalk.cyan(String(value));
	}
	if (typeof value === "string") {
		if (value.includes("@") || (value.includes("-") && value.length > 20)) {
			return chalk.yellow(`"${value}"`);
		}
		return chalk.white(`"${value}"`);
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return chalk.gray("[]");
		}
		if (value.length <= 3) {
			return chalk.blue("[") + value.map((v) => _formatValue(v, 0)).join(", ") + chalk.blue("]");
		}
		return (
			chalk.blue("[") +
			"\n" +
			value
				.slice(0, 2)
				.map((v) => `${prefix}  ${_formatValue(v, indent + 1)}`)
				.join(",\n") +
			chalk.gray(`\n${prefix}  ... ${value.length - 2} more`) +
			"\n" +
			prefix +
			chalk.blue("]")
		);
	}

	if (typeof value === "object") {
		const keys = Object.keys(value);
		if (keys.length === 0) {
			return chalk.gray("{}");
		}
		const isSimple = keys.length <= 3 && !keys.some((k) => typeof value[k] === "object");

		if (isSimple) {
			return (
				chalk.blue("{") +
				Object.entries(value)
					.map(([k, v]) => `${chalk.gray(k)}: ${_formatValue(v, 0)}`)
					.join(", ") +
				chalk.blue("}")
			);
		}

		return (
			chalk.blue("{\n") +
			keys
				.map((k) => `${prefix}  ${chalk.gray(k)}: ${_formatValue(value[k], indent + 1)}`)
				.join(",\n") +
			"\n" +
			prefix +
			chalk.blue("}")
		);
	}

	return String(value);
}

export function logInfo(_message, data = null) {
	const _stamp = new Date().toISOString();
	if (data) {
	}
}

export function logWarn(_message, data = null) {
	const _stamp = new Date().toISOString();
	if (data) {
	}
}

export function logError(_message, error = null) {
	const _stamp = new Date().toISOString();
	if (error) {
		if (error instanceof Error) {
		} else {
		}
	}
}

export const logger = {
	info: logInfo,
	warn: logWarn,
	error: logError,
};
