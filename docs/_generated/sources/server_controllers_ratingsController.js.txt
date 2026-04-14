    1 | import {
    2 |   createRating,
    3 |   getAggregateForProfile,
    4 |   getProfileRatingsSummary,
    5 |   getRatingsForProfiles,
    6 |   getSearchRatingCards,
    7 |   listPendingFeedbackRequestsForUser,
    8 |   recordMilestone,
    9 |   updateRating,
   10 |   deleteRating,
   11 | } from '../services/ratingsService.js'
   12 | 
   13 | export async function getProfileRatings(req, res) {
   14 |   const summary = await getProfileRatingsSummary(req.params.profileKey)
   15 |   return res.json(summary)
   16 | }
   17 | 
   18 | export async function getProfileRatingsBatch(req, res) {
   19 |   const keys = String(req.query.profile_keys || '')
   20 |     .split(',')
   21 |     .map((entry) => entry.trim())
   22 |     .filter(Boolean)
   23 |   return res.json(await getRatingsForProfiles(keys))
   24 | }
   25 | 
   26 | export async function getProfileRatingsAggregate(req, res) {
   27 |   return res.json(await getAggregateForProfile(req.params.profileKey))
   28 | }
   29 | 
   30 | export async function getSearchRatings(req, res) {
   31 |   const keys = String(req.query.profile_keys || '')
   32 |     .split(',')
   33 |     .map((entry) => entry.trim())
   34 |     .filter(Boolean)
   35 |   return res.json(await getSearchRatingCards(keys))
   36 | }
   37 | 
   38 | export async function submitRating(req, res) {
   39 |   const row = await createRating({
   40 |     profileKey: req.params.profileKey,
   41 |     fromUserId: req.user.id,
   42 |     interactionType: req.body?.interaction_type,
   43 |     score: req.body?.score,
   44 |     comment: req.body?.comment,
   45 |     reliabilityFlags: req.body?.reliability_flags || {},
   46 |   })
   47 |   return res.status(201).json(row)
   48 | }
   49 | 
   50 | export async function editRating(req, res) {
   51 |   try {
   52 |     const row = await updateRating({
   53 |       ratingId: req.params.id,
   54 |       actorId: req.user.id,
   55 |       score: req.body?.score,
   56 |       comment: req.body?.comment,
   57 |     })
   58 |     if (!row) return res.status(404).json({ error: 'Rating not found' })
   59 |     return res.json(row)
   60 |   } catch (error) {
   61 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to edit rating' })
   62 |   }
   63 | }
   64 | 
   65 | export async function removeRating(req, res) {
   66 |   try {
   67 |     const row = await deleteRating({ ratingId: req.params.id, actorId: req.user.id })
   68 |     if (!row) return res.status(404).json({ error: 'Rating not found' })
   69 |     return res.json({ ok: true })
   70 |   } catch (error) {
   71 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to delete rating' })
   72 |   }
   73 | }
   74 | 
   75 | export async function getFeedbackRequests(req, res) {
   76 |   const rows = await listPendingFeedbackRequestsForUser(req.user?.id)
   77 |   return res.json({ items: rows })
   78 | }
   79 | 
   80 | export async function completeMilestone(req, res) {
   81 |   const response = await recordMilestone({
   82 |     profileKey: req.body?.profile_key,
   83 |     counterpartyId: req.body?.counterparty_id,
   84 |     interactionType: req.body?.interaction_type,
   85 |     milestone: req.body?.milestone,
   86 |     actorId: req.user.id,
   87 |   })
   88 | 
   89 |   if (!response) return res.status(400).json({ error: 'profile_key, counterparty_id and milestone are required' })
   90 |   return res.status(201).json(response)
   91 | }
   92 | 