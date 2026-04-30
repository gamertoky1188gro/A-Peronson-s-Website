    1 | import crypto from 'crypto'
    2 | 
    3 | function parseUrlList(raw) {
    4 |   return String(raw || '')
    5 |     .split(',')
    6 |     .map((value) => value.trim())
    7 |     .filter(Boolean)
    8 | }
    9 | 
   10 | function buildTurnRestCredential(sharedSecret, username) {
   11 |   return crypto
   12 |     .createHmac('sha1', String(sharedSecret))
   13 |     .update(String(username))
   14 |     .digest('base64')
   15 | }
   16 | 
   17 | export function buildIceServers({ userId = '' } = {}) {
   18 |   const iceServers = []
   19 | 
   20 |   const stunUrls = parseUrlList(process.env.STUN_URLS)
   21 |   const stunFallback = ['stun:stun.l.google.com:19302']
   22 |   const resolvedStunUrls = stunUrls.length > 0 ? stunUrls : stunFallback
   23 |   if (resolvedStunUrls.length > 0) iceServers.push({ urls: resolvedStunUrls })
   24 | 
   25 |   const turnUrls = parseUrlList(process.env.TURN_URLS)
   26 |   if (turnUrls.length === 0) return iceServers
   27 | 
   28 |   const sharedSecret = String(process.env.TURN_SHARED_SECRET || '').trim()
   29 |   const staticUsername = String(process.env.TURN_USERNAME || '').trim()
   30 |   const staticCredential = String(process.env.TURN_CREDENTIAL || '').trim()
   31 |   const ttlSeconds = Math.max(60, Number(process.env.TURN_TTL_SECONDS || 3600))
   32 | 
   33 |   if (sharedSecret) {
   34 |     const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds
   35 |     const username = `${expiresAt}:${userId || 'user'}`
   36 |     const credential = buildTurnRestCredential(sharedSecret, username)
   37 |     iceServers.push({
   38 |       urls: turnUrls,
   39 |       username,
   40 |       credential,
   41 |       credentialType: 'password',
   42 |     })
   43 |     return iceServers
   44 |   }
   45 | 
   46 |   if (staticUsername && staticCredential) {
   47 |     iceServers.push({
   48 |       urls: turnUrls,
   49 |       username: staticUsername,
   50 |       credential: staticCredential,
   51 |       credentialType: 'password',
   52 |     })
   53 |   }
   54 | 
   55 |   return iceServers
   56 | }
   57 | 
   58 | 