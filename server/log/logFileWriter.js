import fs from "node:fs";
import path from "node:path";

const MEGABYTE = 1024 * 1024;
const MAX_SIZE = 100 * MEGABYTE;
const TRIM_AMOUNT = 1 * MEGABYTE;
const FLUSH_INTERVAL_MS = 500;
const BATCH_THRESHOLD = 50;
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), "log");
const LOG_FILE = process.env.LOG_FILE || path.join(LOG_DIR, "gartexhub.log");

class LogFileWriter {
	constructor(filePath = LOG_FILE, maxSize = MAX_SIZE) {
		this.filePath = filePath;
		this.maxSize = maxSize;
		this.currentSize = 0;
		this.writeQueue = [];
		this.flushTimer = null;
		this.writing = false;
		this.initialized = false;
	}

	init() {
		try {
			fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
			const stat = fs.statSync(this.filePath);
			this.currentSize = stat.size;
		} catch {
			this.currentSize = 0;
		}
		this.initialized = true;
	}

	append(entry) {
		if (!this.initialized) {
			this.init();
		}
		if (!entry || typeof entry !== "object") {
			return;
		}
		const line = JSON.stringify({
			ts: entry.ts || new Date().toISOString(),
			level: entry.level || "info",
			source: entry.source || "server",
			category: entry.category || "",
			message: entry.message || "",
			...(entry.data !== null && entry.data !== undefined && Object.keys(entry.data).length > 0
				? { data: entry.data }
				: {}),
		});
		this.writeQueue.push(line);
		if (this.writeQueue.length >= BATCH_THRESHOLD) {
			this.flush();
		} else if (!this.flushTimer) {
			this.flushTimer = setTimeout(() => {
				this.flushTimer = null;
				this.flush();
			}, FLUSH_INTERVAL_MS);
			if (this.flushTimer.unref) {
				this.flushTimer.unref();
			}
		}
	}

	flush() {
		if (this.writing || this.writeQueue.length === 0) {
			return;
		}
		this.writing = true;
		const batch = this.writeQueue.splice(0, this.writeQueue.length);
		const data = `${batch.join("\n")}\n`;
		fs.appendFile(this.filePath, data, (err) => {
			if (!err) {
				this.currentSize += Buffer.byteLength(data);
			}
			this.writing = false;
			if (this.currentSize > this.maxSize) {
				this._trim();
			}
			if (this.writeQueue.length > 0) {
				this.flush();
			}
		});
	}

	_trim() {
		try {
			const content = fs.readFileSync(this.filePath, "utf-8");
			const trimTo = Math.max(0, content.length - TRIM_AMOUNT);
			const newlineIdx = content.indexOf("\n", trimTo);
			const trimmed = newlineIdx === -1 ? "" : content.slice(newlineIdx + 1);
			const tmpPath = `${this.filePath}.tmp`;
			fs.writeFileSync(tmpPath, trimmed, "utf-8");
			fs.renameSync(tmpPath, this.filePath);
			this.currentSize = Buffer.byteLength(trimmed, "utf-8");
		} catch {
			// if trim fails, leave the file as-is
		}
	}

	stop() {
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
		if (this.writeQueue.length > 0) {
			this.flush();
		}
	}
}

export const logFileWriter = new LogFileWriter();
