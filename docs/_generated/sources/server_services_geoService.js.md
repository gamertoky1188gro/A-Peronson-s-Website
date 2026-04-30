    1 | const IP_GEO_TTL_MS = 6 * 60 * 60 * 1000
    2 | const SEARCH_TTL_MS = 60 * 60 * 1000
    3 | 
    4 | const ipCache = new Map()
    5 | const searchCache = new Map()
    6 | 
    7 | function now() {
    8 |   return Date.now()
    9 | }
   10 | 
   11 | function cacheGet(cache, key) {
   12 |   const entry = cache.get(key)
   13 |   if (!entry) return null
   14 |   if (entry.expires_at && entry.expires_at < now()) {
   15 |     cache.delete(key)
   16 |     return null
   17 |   }
   18 |   return entry.value || null
   19 | }
   20 | 
   21 | function cacheSet(cache, key, value, ttlMs) {
   22 |   cache.set(key, { value, expires_at: now() + ttlMs })
   23 | }
   24 | 
   25 | function sanitizeIp(value) {
   26 |   const raw = String(value || '').trim()
   27 |   if (!raw) return ''
   28 |   const parts = raw.split(',').map((p) => p.trim()).filter(Boolean)
   29 |   return parts[0] || ''
   30 | }
   31 | 
   32 | export function extractClientIp(req) {
   33 |   const candidates = [
   34 |     req.headers['x-forwarded-for'],
   35 |     req.headers['cf-connecting-ip'],
   36 |     req.headers['x-real-ip'],
   37 |     req.ip,
   38 |   ]
   39 |   for (const candidate of candidates) {
   40 |     const ip = sanitizeIp(candidate)
   41 |     if (ip) return ip
   42 |   }
   43 |   return ''
   44 | }
   45 | 
   46 | export async function locateIp(ip = '') {
   47 |   const safeIp = sanitizeIp(ip)
   48 |   if (!safeIp) return null
   49 |   const cached = cacheGet(ipCache, safeIp)
   50 |   if (cached) return cached
   51 | 
   52 |   if (typeof fetch !== 'function') return null
   53 |   try {
   54 |     const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(safeIp)}?fields=status,message,country,countryCode,regionName,city,lat,lon,query`, {
   55 |       headers: { 'user-agent': 'GarTexHub/1.0' },
   56 |     })
   57 |     const data = await res.json().catch(() => ({}))
   58 |     if (!res.ok || data?.status !== 'success') return null
   59 |     const geo = {
   60 |       ip: data.query,
   61 |       country: data.country || '',
   62 |       country_code: data.countryCode || '',
   63 |       region: data.regionName || '',
   64 |       city: data.city || '',
   65 |       lat: Number.isFinite(Number(data.lat)) ? Number(data.lat) : null,
   66 |       lng: Number.isFinite(Number(data.lon)) ? Number(data.lon) : null,
   67 |     }
   68 |     cacheSet(ipCache, safeIp, geo, IP_GEO_TTL_MS)
   69 |     return geo
   70 |   } catch {
   71 |     return null
   72 |   }
   73 | }
   74 | 
   75 | export async function searchGeo(query = '') {
   76 |   const term = String(query || '').trim()
   77 |   if (!term) return []
   78 |   const cached = cacheGet(searchCache, term.toLowerCase())
   79 |   if (cached) return cached
   80 | 
   81 |   if (typeof fetch !== 'function') return []
   82 |   try {
   83 |     const url = new URL('https://nominatim.openstreetmap.org/search')
   84 |     url.searchParams.set('q', term)
   85 |     url.searchParams.set('format', 'json')
   86 |     url.searchParams.set('addressdetails', '1')
   87 |     url.searchParams.set('limit', '6')
   88 |     const res = await fetch(url.toString(), {
   89 |       headers: { 'user-agent': 'GarTexHub/1.0 (contact@gartexhub.com)' },
   90 |     })
   91 |     const data = await res.json().catch(() => [])
   92 |     const results = Array.isArray(data)
   93 |       ? data.map((row) => ({
   94 |         id: row.place_id,
   95 |         label: row.display_name,
   96 |         lat: Number(row.lat),
   97 |         lng: Number(row.lon),
   98 |       })).filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lng))
   99 |       : []
  100 |     cacheSet(searchCache, term.toLowerCase(), results, SEARCH_TTL_MS)
  101 |     return results
  102 |   } catch {
  103 |     return []
  104 |   }
  105 | }
  106 | 