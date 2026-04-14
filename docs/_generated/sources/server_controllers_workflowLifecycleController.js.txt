    1 | import {
    2 |   createWorkflowJourney,
    3 |   getWorkflowJourneyById,
    4 |   getWorkflowJourneyByMatchId,
    5 |   transitionWorkflowJourney,
    6 | } from '../services/workflowLifecycleService.js'
    7 | 
    8 | export async function createJourney(req, res) {
    9 |   const row = await createWorkflowJourney({
   10 |     ...req.body,
   11 |     actor_id: req.user?.id,
   12 |     source: 'workflow_api',
   13 |   })
   14 |   return res.status(201).json(row)
   15 | }
   16 | 
   17 | export async function transitionJourney(req, res) {
   18 |   const result = await transitionWorkflowJourney(req.params.id, {
   19 |     ...req.body,
   20 |     actor_id: req.user?.id,
   21 |     source: 'workflow_api',
   22 |   })
   23 | 
   24 |   if (!result?.ok) {
   25 |     return res.status(result.status || 409).json({ error: result.error?.message || 'Transition rejected', code: result.error?.code, allowed_next_states: result.error?.allowed_next_states || [] })
   26 |   }
   27 | 
   28 |   return res.json(result.journey)
   29 | }
   30 | 
   31 | export async function getJourney(req, res) {
   32 |   const row = await getWorkflowJourneyById(req.params.id)
   33 |   if (!row) return res.status(404).json({ error: 'Workflow journey not found', code: 'WORKFLOW_JOURNEY_NOT_FOUND' })
   34 |   return res.json(row)
   35 | }
   36 | 
   37 | export async function getJourneyByMatch(req, res) {
   38 |   const row = await getWorkflowJourneyByMatchId(req.params.matchId)
   39 |   if (!row) return res.status(404).json({ error: 'Workflow journey not found', code: 'WORKFLOW_JOURNEY_NOT_FOUND' })
   40 |   return res.json(row)
   41 | }
   42 | 