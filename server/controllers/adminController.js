import { readJson } from '../utils/jsonStore.js'

export async function auditMatches(req, res) {
  const matches = await readJson('matches.json')
  return res.json(matches)
}

export async function conversionMetrics(req, res) {
  const metrics = await readJson('metrics.json')
  return res.json(metrics)
}
