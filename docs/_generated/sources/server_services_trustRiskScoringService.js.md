    1 | import crypto from 'crypto'
    2 | import prisma from '../utils/prisma.js'
    3 | 
    4 | const MAX_SIGNAL = 100
    5 | 
    6 | function clamp(value, min = 0, max = MAX_SIGNAL) {
    7 |   const num = Number(value)
    8 |   if (!Number.isFinite(num)) return min
    9 |   return Math.max(min, Math.min(max, num))
   10 | }
   11 | 
   12 | function daysSince(value) {
   13 |   if (!value) return null
   14 |   const ts = new Date(value).getTime()
   15 |   if (!Number.isFinite(ts)) return null
   16 |   return Math.max(0, Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000)))
   17 | }
   18 | 
   19 | export async function computeTrustRiskSignals({ userId }) {
   20 |   const id = String(userId || '').trim()
   21 |   if (!id) {
   22 |     const error = new Error('userId is required')
   23 |     error.status = 400
   24 |     throw error
   25 |   }
   26 | 
   27 |   const [user, verification, disputes, suspiciousMessages, breaches] = await Promise.all([
   28 |     prisma.user.findUnique({ where: { id } }),
   29 |     prisma.verification.findUnique({ where: { user_id: id } }),
   30 |     prisma.report.findMany({
   31 |       where: {
   32 |         actor_id: id,
   33 |         entity_type: 'dispute',
   34 |       },
   35 |       orderBy: { created_at: 'desc' },
   36 |       take: 36,
   37 |     }),
   38 |     prisma.messagePolicyDecision.findMany({
   39 |       where: {
   40 |         sender_id: id,
   41 |         OR: [
   42 |           { action: 'block' },
   43 |           { requires_human_review: true },
   44 |         ],
   45 |       },
   46 |       orderBy: { created_at: 'desc' },
   47 |       take: 100,
   48 |     }),
   49 |     prisma.report.findMany({
   50 |       where: {
   51 |         actor_id: id,
   52 |         entity_type: 'contract',
   53 |         OR: [
   54 |           { resolution_action: { contains: 'breach' } },
   55 |           { reason: { contains: 'breach' } },
   56 |         ],
   57 |       },
   58 |       orderBy: { created_at: 'desc' },
   59 |       take: 24,
   60 |     }),
   61 |   ])
   62 | 
   63 |   const verificationDays = daysSince(verification?.verified_at)
   64 |   const verificationRecency = verificationDays == null
   65 |     ? 100
   66 |     : clamp(Math.round((verificationDays / 180) * 100))
   67 | 
   68 |   const disputeHistory = clamp(disputes.length * 15)
   69 |   const suspiciousMessaging = clamp(suspiciousMessages.length * 8)
   70 |   const contractBreach = clamp(breaches.length * 30)
   71 | 
   72 |   const trustScore = clamp(100 - (
   73 |     verificationRecency * 0.25 +
   74 |     disputeHistory * 0.25 +
   75 |     suspiciousMessaging * 0.30 +
   76 |     contractBreach * 0.20
   77 |   ))
   78 | 
   79 |   return {
   80 |     user_id: id,
   81 |     role: user?.role || null,
   82 |     trust_score: Number(trustScore.toFixed(2)),
   83 |     signals: {
   84 |       verification_recency: verificationRecency,
   85 |       dispute_history: disputeHistory,
   86 |       suspicious_messaging_behavior: suspiciousMessaging,
   87 |       contract_breach_flags: contractBreach,
   88 |     },
   89 |   }
   90 | }
   91 | 
   92 | export async function recordTrustRiskEvaluation({ userId, decision = null }) {
   93 |   const computed = await computeTrustRiskSignals({ userId })
   94 |   const created = await prisma.trustRiskEvaluation.create({
   95 |     data: {
   96 |       id: crypto.randomUUID(),
   97 |       user_id: computed.user_id,
   98 |       role: computed.role,
   99 |       trust_score: computed.trust_score,
  100 |       verification_recency: computed.signals.verification_recency,
  101 |       dispute_history: computed.signals.dispute_history,
  102 |       suspicious_messaging: computed.signals.suspicious_messaging_behavior,
  103 |       contract_breach: computed.signals.contract_breach_flags,
  104 |       decision,
  105 |       signals: computed.signals,
  106 |     },
  107 |   })
  108 | 
  109 |   return created
  110 | }
  111 | 