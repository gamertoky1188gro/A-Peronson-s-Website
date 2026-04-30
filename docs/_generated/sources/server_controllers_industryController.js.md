    1 | import { assistantReply } from '../services/assistantService.js'
    2 | import { getIndustrySummary } from '../services/industryService.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | 
    5 | export async function getIndustryPage(req, res) {
    6 |   const summary = await getIndustrySummary(req.params.slug)
    7 |   if (!summary) return res.status(404).json({ error: 'Industry not found' })
    8 |   return res.json(summary)
    9 | }
   10 | 
   11 | export async function getIndustryAutoReply(req, res) {
   12 |   const summary = await getIndustrySummary(req.params.slug)
   13 |   if (!summary) return res.status(404).json({ error: 'Industry not found' })
   14 | 
   15 |   const stats = summary.stats || {}
   16 |   const topProducts = (summary.top_products || [])
   17 |     .slice(0, 3)
   18 |     .map((p) => `${p.title}${p.moq ? ` (MOQ ${p.moq})` : ''}`)
   19 |     .join(', ')
   20 | 
   21 |   const prompt = [
   22 |     `Create a short auto-reply for a buyer exploring the "${summary.category}" industry page.`,
   23 |     'Keep it friendly and professional, 2-4 sentences.',
   24 |     `Stats: average MOQ ${stats.average_moq ?? 'n/a'}, average lead time ${stats.average_lead_time_days ?? 'n/a'} days.`,
   25 |     stats.top_countries?.length ? `Top buyer regions: ${stats.top_countries.map((c) => c.country).join(', ')}.` : '',
   26 |     topProducts ? `Popular products: ${topProducts}.` : '',
   27 |     'Invite the buyer to share missing requirements (MOQ, price range, lead time).',
   28 |   ].filter(Boolean).join('\n')
   29 | 
   30 |   const response = await assistantReply('public_industry', prompt)
   31 |   const reply = sanitizeString(response?.matched_answer || response?.answer || '', 700)
   32 | 
   33 |   return res.json({
   34 |     ok: true,
   35 |     reply: reply || `Thanks for exploring ${summary.category}. Share your MOQ, target price range, and lead time so we can match you quickly.`,
   36 |     stats,
   37 |   })
   38 | }
   39 | 
   40 | 