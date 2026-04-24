import {
  getIntegrationStatus,
  runIntegrationAction,
} from "../services/integrationStatusService.js";
import { getOpenSearchStatus } from "../services/openSearchService.js";
import { getEmailDeliveryStatus } from "../services/emailService.js";

export async function integrationStatusController(req, res) {
  const status = await getIntegrationStatus();
  return res.json(status);
}

export async function integrationActionController(req, res) {
  const action = String(req.body?.action || "").trim();
  const payload = req.body?.payload || {};
  const result = await runIntegrationAction(action, payload);
  return res.json(result);
}

export async function integrationOpenSearchStatusController(req, res) {
  const status = await getOpenSearchStatus();
  return res.json(status);
}

export async function integrationEmailStatusController(req, res) {
  const status = await getEmailDeliveryStatus();
  return res.json(status);
}
