import WebSocket from "ws";

const url = process.env.WS_URL || "ws://localhost:4000/ws";
const reqId = `test-ask-${Date.now()}`;

const ws = new WebSocket(url);
let replied = false;

ws.on("open", () => {
	ws.send(
		JSON.stringify({
			type: "ask",
			question: "What is GarTex Hub?",
			request_id: reqId,
		}),
	);
});

ws.on("message", (m) => {
	try {
		const d = JSON.parse(String(m || ""));
		if (d.type === "reply" && d.request_id === reqId) {
			replied = true;
			ws.close();
			process.exit(0);
		}
	} catch {}
});

ws.on("error", (_err) => {
	process.exit(2);
});

setTimeout(() => {
	if (!replied) {
		process.exit(2);
	}
}, 20_000);
