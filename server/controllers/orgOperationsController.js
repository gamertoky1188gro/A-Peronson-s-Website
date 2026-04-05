import {
  escalateOrgLead,
  getOrgPolicies,
  getOrgQueue,
  listLeadAssignmentHistory,
  rebalanceOrgQueue,
  updateOrgPolicies,
} from '../services/orgOperationsService.js'
import { handleControllerError } from '../utils/permissions.js'

export async function getOperationsPolicies(req, res) {
  try {
    const policy = await getOrgPolicies(req.user)
    return res.json(policy)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function putOperationsPolicies(req, res) {
  try {
    const policy = await updateOrgPolicies(req.user, req.body || {})
    return res.json(policy)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function getOperationsQueue(req, res) {
  try {
    const queue = await getOrgQueue(req.user)
    const assignments = await listLeadAssignmentHistory(req.user)
    return res.json({ ...queue, assignments })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function postOperationsRebalance(req, res) {
  try {
    const result = await rebalanceOrgQueue(req.user, req.body || {})
    return res.json(result)
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function postOperationsEscalate(req, res) {
  try {
    const lead = await escalateOrgLead(req.user, req.params.leadId, req.body || {})
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    return res.json(lead)
  } catch (error) {
    return handleControllerError(res, error)
  }
}
