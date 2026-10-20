import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { OpenCode } from "@opencode/client";
import { logInfo, logWarn } from "../../utils/logger.js";
import { parseModelChain } from "./modelChain.js";

const PORT_RANGE_START = 4200;
const PORT_RANGE_END = 4299;
const SERVER_USER = "opencode";
const POLL_INTERVAL_MS = 1200;
const STABLE_POLLS_TO_SETTLE = 20;

const POWERSHELL_SHIM_TARGET = /& "([^"]*opencode\.exe)"/;
const CMD_SHIM_TARGET = /"?%~dp0\\?([^"]*?opencode\.exe)"?/i;
const V2_VERSION = /v2\.\d+/i;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Read the real executable out of a pnpm shim.
 *
 * The pnpm shims are PowerShell/cmd wrappers around a hashed `.exe`. The
 * PowerShell one interpolates `$basedir` at runtime, so the literal path in the
 * file is not a usable path until it is expanded.
 */
function readShimTarget(shimPath) {
	try {
		const text = fs.readFileSync(shimPath, "utf8");
		const dir = path.dirname(shimPath);
		const psMatch = text.match(POWERSHELL_SHIM_TARGET);
		if (psMatch) {
			const raw = psMatch[1].replace(/\$basedir/g, dir).replace(/^\/\//, "\\\\");
			return path.resolve(raw);
		}
		const cmdMatch = text.match(CMD_SHIM_TARGET);
		if (cmdMatch) {
			return path.resolve(dir, cmdMatch[1].replace(/\\/g, path.sep));
		}
	} catch {
		return null;
	}
	return null;
}

/**
 * opencode v1 and v2 expose incompatible APIs. A v1 binary answers the v2
 * routes with the SPA's HTML, so the runtime has to refuse to start on one.
 */
function isV2Binary(binary) {
	try {
		const result = spawnSync(binary, ["--version"], {
			encoding: "utf8",
			timeout: 20_000,
			windowsHide: true,
		});
		const version = `${result.stdout || ""}${result.stderr || ""}`;
		return V2_VERSION.test(version);
	} catch {
		return false;
	}
}

function resolveBinary() {
	const explicit = process.env.OPENCODE_BIN;
	if (explicit && fs.existsSync(explicit)) {
		return { command: explicit, shell: false };
	}

	const candidates = [];
	if (process.platform === "win32") {
		const localAppData = process.env.LOCALAPPDATA || "";
		for (const shim of ["opencode.ps1", "opencode.cmd", "opencode.CMD"]) {
			const target = readShimTarget(path.join(localAppData, "pnpm", "bin", shim));
			if (target && fs.existsSync(target)) {
				candidates.push(target);
			}
		}
	} else {
		candidates.push("opencode");
	}

	for (const candidate of candidates) {
		if (isV2Binary(candidate)) {
			return { command: candidate, shell: false };
		}
	}

	// PATH fallback. `node_modules/.bin/opencode` is the v1 package and would
	// shadow the global v2 CLI under an npm script, so it is only used when
	// nothing better turned up.
	const fallback = process.platform === "win32" ? "opencode.cmd" : "opencode";
	logWarn("investigation runtime binary not verified as opencode v2", {
		fallback,
		setOpencodeBin: "set OPENCODE_BIN to the opencode v2 executable",
	});
	return { command: fallback, shell: true };
}

function findFreePort(start, attempts) {
	return new Promise((resolve) => {
		let cursor = start;
		const tryPort = (port) => {
			const server = net.createServer();
			server.once("error", () => {
				server.close(() => {
					if (cursor >= start + attempts - 1) {
						resolve(null);
					} else {
						cursor += 1;
						tryPort(cursor);
					}
				});
			});
			server.once("listening", () => server.close(() => resolve(port)));
			server.listen(port, "127.0.0.1");
		};
		tryPort(cursor);
	});
}

export async function startInvestigationRuntime({
	cwd,
	config,
	password,
	port,
	env = {},
	readyTimeoutMs = 180_000,
}) {
	const chosenPort =
		port || (await findFreePort(PORT_RANGE_START, PORT_RANGE_END - PORT_RANGE_START + 1));
	if (!chosenPort) throw new Error("No free port for the investigation runtime");

	// The runtime gets its OWN config directory. The developer's global
	// opencode config normally declares MCP servers (and plugins, and skills);
	// inheriting them would hand the investigator ambient capabilities that the
	// restrictive config cannot take away. `OPENCODE_CONFIG_PROJECT_DISABLE`
	// stops a stray `opencode.json` in the repository from widening the rules.
	const isolatedConfigDir = fs.mkdtempSync(
		path.join(os.tmpdir(), "opencode-investigation-config-"),
	);

	const binary = resolveBinary();
	const child = spawn(
		binary.command,
		["serve", "--port", String(chosenPort), "--hostname", "127.0.0.1"],
		{
			cwd,
			stdio: ["ignore", "pipe", "pipe"],
			shell: binary.shell,
			windowsHide: true,
			env: {
				...process.env,
				OPENCODE_SERVER_PASSWORD: password,
				OPENCODE_CONFIG_CONTENT: JSON.stringify(config),
				OPENCODE_LOG_LEVEL: "ERROR",
				OPENCODE_CONFIG_DIR: isolatedConfigDir,
				OPENCODE_CONFIG_PROJECT_DISABLE: "1",
				...env,
			},
		},
	);

	// The child writes to stdout for the lifetime of the runtime. The pipe has
	// to be drained or the child blocks once the buffer fills.
	child.stdout.on("data", () => {});
	child.stderr.on("data", (chunk) => {
		const line = String(chunk).trim();
		if (line) logWarn("investigation runtime stderr", { line: line.slice(0, 300) });
	});
	child.on("error", (error) => {
		logWarn("investigation runtime process error", { error: error.message });
	});

	const baseUrl = `http://127.0.0.1:${chosenPort}`;
	const authorization = `Basic ${Buffer.from(`${SERVER_USER}:${password}`).toString("base64")}`;
	const client = OpenCode.make({
		baseUrl,
		// The client builds a `Headers` instance. Spreading it with `{...headers}`
		// yields `{}` and silently drops `content-type`, which the server
		// answers with 415. Rebuild it instead.
		fetch: (input, init = {}) => {
			const headers = new Headers(init.headers || {});
			headers.set("Authorization", authorization);
			return fetch(input, { ...init, headers });
		},
	});

	const deadline = Date.now() + readyTimeoutMs;
	let ready = false;
	let lastError = null;
	while (Date.now() < deadline) {
		try {
			// `model.list()` only answers once the location has finished
			// activating its plugins. `/api/config` answers much earlier, while
			// the server is still initializing, so it is not a readiness signal.
			await client.model.list();
			ready = true;
			break;
		} catch (error) {
			lastError = error;
		}
		await sleep(1000);
	}
	if (!ready) {
		try {
			child.kill();
		} catch {
			// already gone
		}
		try {
			fs.rmSync(isolatedConfigDir, { recursive: true, force: true });
		} catch {
			// best effort
		}
		const reason = lastError?.message ? ` (last error: ${lastError.message})` : "";
		throw new Error(`Investigation runtime did not become ready on port ${chosenPort}${reason}`);
	}
	logInfo("investigation runtime started", {
		port: chosenPort,
		cwd,
		binary: binary.command,
		configDir: isolatedConfigDir,
	});

	return {
		baseUrl,
		port: chosenPort,
		client,
		stop: async () => {
			try {
				child.kill();
			} catch {
				// already gone
			}
			try {
				fs.rmSync(isolatedConfigDir, { recursive: true, force: true });
			} catch {
				// best effort
			}
		},
	};
}

export async function createInvestigationSession({ client, title, model, directory }) {
	const created = await client.session.create({
		title,
		model: { id: model.id, providerID: model.providerID },
		location: { directory },
	});
	const id = created?.data?.id || created?.id;
	if (!id) throw new Error("Could not create an investigation session");
	return id;
}

function collectMessages(listed) {
	const messages = listed?.data || listed || [];
	return Array.isArray(messages) ? messages : [];
}

/**
 * The v2 tool error payload is a structured object, not a string. `String()`
 * on it yields "[object Object]", which hides the reason a call was refused.
 */
function formatToolError(error) {
	if (!error) return;
	if (typeof error === "string") return error;
	const message = error.data?.message || error.message || error.name;
	const detail = message ? String(message) : JSON.stringify(error);
	return detail.slice(0, 400);
}

/**
 * Send one prompt and wait for the assistant turn to settle.
 *
 * `session.prompt` is asynchronous on the v2 API: it returns as soon as the
 * user message is queued. The assistant turn has to be polled for.
 *
 * Two things about the v2 message list are easy to get wrong:
 *  - It is ordered NEWEST FIRST. The oldest assistant message of a turn is the
 *    one that opened it, not the one that answered it.
 *  - A tool call's state moves streaming -> running -> completed without the
 *    content array changing size, so "the content stopped growing" is not a
 *    settle signal. The turn is over when the newest assistant message carries
 *    a `finish` that is not `tool-calls`, or when nothing has changed for a
 *    while and no tool is still running.
 */
export async function runAgentPrompt({ client, sessionID, text, timeoutMs = 180_000 }) {
	let seen = new Set();
	try {
		seen = new Set(
			collectMessages(await client.message.list({ sessionID }))
				.map((message) => message.id)
				.filter(Boolean),
		);
	} catch {
		seen = new Set();
	}

	try {
		await client.session.prompt({ sessionID, text });
	} catch (error) {
		return { text: "", toolCalls: [], error: error?.message || String(error) };
	}

	const deadline = Date.now() + timeoutMs;
	let toolCalls = [];
	let texts = [];
	let agent = null;
	let stablePolls = 0;
	let signature = "";

	while (Date.now() < deadline) {
		await sleep(POLL_INTERVAL_MS);
		let fresh = [];
		try {
			fresh = collectMessages(await client.message.list({ sessionID })).filter(
				(message) => !seen.has(message.id),
			);
		} catch {
			continue;
		}

		// `fresh` is newest first; reverse it so the text reads chronologically.
		const assistants = fresh.filter((message) => message.type === "assistant").reverse();
		const newest = assistants[assistants.length - 1];
		const allContent = assistants.flatMap((message) => message.content || []);

		toolCalls = allContent
			.filter((part) => part.type === "tool")
			.map((part) => ({
				tool: part.tool || part.name || "unknown",
				status: part.state?.status || "unknown",
				error: part.state?.error ? formatToolError(part.state.error) : undefined,
			}));
		texts = allContent.filter((part) => part.type === "text").map((part) => part.text || "");

		if (newest?.agent) agent = newest.agent;

		if (process.env.INVESTIGATION_DEBUG) {
			console.log(
				"DEBUG turn state",
				JSON.stringify({
					fresh: fresh.map((message) => ({
						type: message.type,
						finish: message.finish,
						outcome: message.outcome,
						agent: message.agent,
						content: (message.content || []).map((part) => ({
							type: part.type,
							text: part.text,
							status: part.state?.status,
						})),
					})),
					newestFinish: newest?.finish,
				}),
			);
		}

		const nextSignature = JSON.stringify([
			assistants.length,
			allContent.length,
			toolCalls.map((call) => `${call.tool}:${call.status}`),
		]);
		if (nextSignature === signature) stablePolls += 1;
		else {
			signature = nextSignature;
			stablePolls = 0;
		}

		const finished = Boolean(newest?.finish) && newest.finish !== "tool-calls";
		const idle = fresh.some((message) => message.type === "idle");
		const stillRunning = toolCalls.some(
			(call) => call.status === "running" || call.status === "streaming",
		);
		if (finished) break;
		if (idle && stablePolls >= 2) break;
		if (stablePolls >= STABLE_POLLS_TO_SETTLE && !stillRunning) break;
	}

	return {
		text: texts.join("\n"),
		toolCalls,
		agent,
	};
}

export async function listAvailableModels(client) {
	const response = await client.model.list();
	const flat = Object.values(response?.data || response || {}).flat();
	return flat
		.filter((model) => model && (model.modelID || model.id))
		.map((model) => ({
			id: model.modelID || model.id,
			providerID: model.providerID,
		}));
}

export { parseModelChain };
