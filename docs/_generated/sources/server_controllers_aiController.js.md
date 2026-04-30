    1 | import {
    2 |   orchestrateRequirementExtraction,
    3 |   orchestrateReplyDraft,
    4 |   approveReply,
    5 |   sendReply,
    6 | } from '../services/aiOrchestrationService.js'
    7 | import { handleControllerError } from '../utils/permissions.js'
    8 | 
    9 | export async function extractRequirements(req, res) {
   10 |   try {
   11 |     const text = String(req.body?.text || '')
   12 |     const result = await orchestrateRequirementExtraction({ text })
   13 |     return res.json(result)
   14 |   } catch (error) {
   15 |     return handleControllerError(res, error)
   16 |   }
   17 | }
   18 | 
   19 | export async function draftReply(req, res) {
   20 |   try {
   21 |     const text = String(req.body?.text || '')
   22 |     const result = await orchestrateReplyDraft({ text })
   23 |     return res.json(result)
   24 |   } catch (error) {
   25 |     return handleControllerError(res, error)
   26 |   }
   27 | }
   28 | 
   29 | export async function approveReplyDraft(req, res) {
   30 |   try {
   31 |     const draft = String(req.body?.draft || '')
   32 |     const extractedRequirements = req.body?.extracted_requirements && typeof req.body.extracted_requirements === 'object'
   33 |       ? req.body.extracted_requirements
   34 |       : {}
   35 |     const allowNumericCommitment = Boolean(req.body?.allow_numeric_commitment)
   36 |     return res.json(approveReply({ draft, extractedRequirements, allowNumericCommitment }))
   37 |   } catch (error) {
   38 |     return handleControllerError(res, error)
   39 |   }
   40 | }
   41 | 
   42 | export async function sendApprovedReply(req, res) {
   43 |   try {
   44 |     const draft = String(req.body?.draft || '')
   45 |     const approval = req.body?.approval && typeof req.body.approval === 'object' ? req.body.approval : {}
   46 |     return res.json(sendReply({ draft, approval }))
   47 |   } catch (error) {
   48 |     return handleControllerError(res, error)
   49 |   }
   50 | }
   51 | 