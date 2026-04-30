    1 | import { handleControllerError } from '../utils/permissions.js'
    2 | import {
    3 |   getDealJourneyByContext,
    4 |   getDealJourneyById,
    5 |   recordJourneyEvent,
    6 |   rollbackDealJourney,
    7 | } from '../services/dealJourneyService.js'
    8 | 
    9 | export async function getJourneyByContext(req, res) {
   10 |   try {
   11 |     const row = await getDealJourneyByContext({
   12 |       requirement_id: req.query.requirement_id,
   13 |       product_id: req.query.product_id,
   14 |       match_id: req.query.match_id,
   15 |       contract_id: req.query.contract_id,
   16 |     })
   17 |     if (!row) return res.status(404).json({ error: 'Deal journey not found' })
   18 |     return res.json(row)
   19 |   } catch (error) {
   20 |     return handleControllerError(res, error)
   21 |   }
   22 | }
   23 | 
   24 | export async function getJourney(req, res) {
   25 |   try {
   26 |     const row = await getDealJourneyById(req.params.journeyId)
   27 |     if (!row) return res.status(404).json({ error: 'Deal journey not found' })
   28 |     return res.json(row)
   29 |   } catch (error) {
   30 |     return handleControllerError(res, error)
   31 |   }
   32 | }
   33 | 
   34 | export async function createJourneyEvent(req, res) {
   35 |   try {
   36 |     const row = await recordJourneyEvent(req.body?.event_type, req.body?.context || {}, req.body?.metadata || {})
   37 |     if (!row) return res.status(400).json({ error: 'Invalid event_type' })
   38 |     return res.status(201).json(row)
   39 |   } catch (error) {
   40 |     return handleControllerError(res, error)
   41 |   }
   42 | }
   43 | 
   44 | export async function rollbackJourney(req, res) {
   45 |   try {
   46 |     const row = await rollbackDealJourney(req.params.journeyId, req.body?.to_state, req.body?.reason, req.user?.id)
   47 |     if (!row) return res.status(404).json({ error: 'Deal journey not found or invalid rollback payload' })
   48 |     return res.json(row)
   49 |   } catch (error) {
   50 |     return handleControllerError(res, error)
   51 |   }
   52 | }
   53 | 