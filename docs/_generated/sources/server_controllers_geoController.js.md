    1 | import { extractClientIp, locateIp, searchGeo } from '../services/geoService.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | 
    4 | export async function geoLocate(req, res) {
    5 |   const ip = extractClientIp(req)
    6 |   const geo = await locateIp(ip)
    7 |   if (!geo) return res.json({ ok: false, geo: null })
    8 |   return res.json({ ok: true, geo })
    9 | }
   10 | 
   11 | export async function geoSearch(req, res) {
   12 |   const query = sanitizeString(String(req.query?.q || ''), 200)
   13 |   if (!query) return res.json({ ok: true, items: [] })
   14 |   const items = await searchGeo(query)
   15 |   return res.json({ ok: true, items })
   16 | }
   17 | 