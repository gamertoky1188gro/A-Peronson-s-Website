/**
 * Formats a byte count as a short human string (B/KB/MB/GB, one decimal
 * under 10, no decimal otherwise). Returns "" for missing/invalid sizes.
 *
 * @param {number} size - Bytes.
 * @returns {string}
 */
export function formatBytes(size) {
	if (!Number.isFinite(size) || size <= 0) {
		return "";
	}
	const units = ["B", "KB", "MB", "GB"];
	let value = size;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit += 1;
	}
	return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}
