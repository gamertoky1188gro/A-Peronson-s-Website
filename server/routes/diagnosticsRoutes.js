import { Router } from "express";
import { runLightDiagnostics, runDeepDiagnostics, reportHealth, getStartTime } from "../services/diagnosticsService.js";
import { logError } from "../utils/logger.js";

const router = Router();

router.get("/diagnostics", async (_req, res) => {
	try {
		const result = await runLightDiagnostics();
		res.json(result);
	} catch (err) {
		logError("diagnostics_light_failed", err);
		res.status(500).json({ error: "Diagnostics check failed" });
	}
});

router.get("/diagnostics/deep", async (_req, res) => {
	try {
		const result = await runDeepDiagnostics();
		res.json(result);
	} catch (err) {
		logError("diagnostics_deep_failed", err);
		res.status(500).json({ error: "Deep diagnostics failed" });
	}
});

router.get("/health", (_req, res) => {
	const health = reportHealth();
	res.json(health);
});

router.get("/uptime", (_req, res) => {
	res.json({ started_at: new Date(getStartTime()).toISOString(), uptime_s: Math.floor((Date.now() - getStartTime()) / 1000) });
});

export default router;
