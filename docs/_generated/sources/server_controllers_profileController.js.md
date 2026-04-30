    1 | import {
    2 |   getProfileOverview,
    3 |   getProfilePartnerNetworkSummary,
    4 |   getProfileProductsPage,
    5 |   getProfileRequestsPage,
    6 | } from '../services/profileService.js'
    7 | 
    8 | function parsePaging(query) {
    9 |   const cursor = Number.isFinite(Number(query?.cursor)) ? Math.max(0, Math.floor(Number(query.cursor))) : 0
   10 |   const limitRaw = Number.isFinite(Number(query?.limit)) ? Math.floor(Number(query.limit)) : 12
   11 |   const limit = Math.min(50, Math.max(1, limitRaw))
   12 |   return { cursor, limit }
   13 | }
   14 | 
   15 | export async function getProfile(req, res) {
   16 |   const data = await getProfileOverview(req.user.id, req.params.userId)
   17 |   if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
   18 |   return res.json(data)
   19 | }
   20 | 
   21 | export async function getProfileRequests(req, res) {
   22 |   const { cursor, limit } = parsePaging(req.query)
   23 |   const data = await getProfileRequestsPage(req.user.id, req.params.userId, { cursor, limit })
   24 |   if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
   25 |   if (data === 'invalid_role') return res.status(400).json({ error: 'Requests only available for buyer profiles' })
   26 |   return res.json(data)
   27 | }
   28 | 
   29 | export async function getProfileProducts(req, res) {
   30 |   const { cursor, limit } = parsePaging(req.query)
   31 |   const data = await getProfileProductsPage(req.user.id, req.params.userId, { cursor, limit })
   32 |   if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
   33 |   if (data === 'invalid_role') return res.status(400).json({ error: 'Products only available for factory / buying house profiles' })
   34 |   return res.json(data)
   35 | }
   36 | 
   37 | export async function getProfilePartnerNetwork(req, res) {
   38 |   const data = await getProfilePartnerNetworkSummary(req.user.id, req.params.userId)
   39 |   if (data === 'not_found') return res.status(404).json({ error: 'User not found' })
   40 |   if (data === 'invalid_role') return res.status(400).json({ error: 'Partner network only available for buying house profiles' })
   41 |   return res.json(data)
   42 | }
   43 | 
   44 | 