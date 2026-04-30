    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | 
    4 | const USERS_FILE = 'users.json'
    5 | const PRODUCTS_FILE = 'company_products.json'
    6 | const REQUIREMENTS_FILE = 'requirements.json'
    7 | 
    8 | function slugify(value = '') {
    9 |   return String(value || '')
   10 |     .toLowerCase()
   11 |     .trim()
   12 |     .replace(/[^a-z0-9]+/g, '-')
   13 |     .replace(/(^-|-$)/g, '')
   14 | }
   15 | 
   16 | function parseNumber(value) {
   17 |   const raw = String(value || '')
   18 |   const match = raw.match(/[\d.]+/)
   19 |   if (!match) return null
   20 |   const parsed = Number(match[0])
   21 |   return Number.isFinite(parsed) ? parsed : null
   22 | }
   23 | 
   24 | function average(values = []) {
   25 |   const filtered = values.filter((v) => Number.isFinite(v))
   26 |   if (!filtered.length) return null
   27 |   const sum = filtered.reduce((acc, v) => acc + v, 0)
   28 |   return Math.round((sum / filtered.length) * 10) / 10
   29 | }
   30 | 
   31 | function normalizeCategory(value) {
   32 |   return sanitizeString(String(value || ''), 120)
   33 | }
   34 | 
   35 | function collectCategories(users = [], products = []) {
   36 |   const counts = new Map()
   37 | 
   38 |   ;(Array.isArray(users) ? users : []).forEach((user) => {
   39 |     const categories = Array.isArray(user?.profile?.categories) ? user.profile.categories : []
   40 |     categories.forEach((cat) => {
   41 |       const cleaned = normalizeCategory(cat)
   42 |       if (!cleaned) return
   43 |       counts.set(cleaned, (counts.get(cleaned) || 0) + 1)
   44 |     })
   45 |   })
   46 | 
   47 |   ;(Array.isArray(products) ? products : []).forEach((product) => {
   48 |     const cat = normalizeCategory(product?.category || product?.industry)
   49 |     if (!cat) return
   50 |     counts.set(cat, (counts.get(cat) || 0) + 1)
   51 |   })
   52 | 
   53 |   return [...counts.entries()]
   54 |     .sort((a, b) => b[1] - a[1])
   55 |     .map(([label, count]) => ({ label, slug: slugify(label), count }))
   56 | }
   57 | 
   58 | function matchesCategory(value, targetSlug, targetLabel) {
   59 |   const raw = normalizeCategory(value)
   60 |   if (!raw) return false
   61 |   if (targetLabel && raw.toLowerCase() === targetLabel.toLowerCase()) return true
   62 |   const s = slugify(raw)
   63 |   return s === targetSlug
   64 | }
   65 | 
   66 | export async function getIndustrySummary(slug) {
   67 |   const safeSlug = slugify(slug || '')
   68 |   if (!safeSlug) return null
   69 | 
   70 |   const [users, products, requirements] = await Promise.all([
   71 |     readJson(USERS_FILE),
   72 |     readJson(PRODUCTS_FILE),
   73 |     readJson(REQUIREMENTS_FILE),
   74 |   ])
   75 | 
   76 |   const categories = collectCategories(users, products)
   77 |   const match = categories.find((c) => c.slug === safeSlug)
   78 |   const label = match?.label || sanitizeString(safeSlug.replace(/-/g, ' '), 120) || safeSlug
   79 | 
   80 |   const productsForCategory = (Array.isArray(products) ? products : [])
   81 |     .filter((p) => matchesCategory(p?.category || p?.industry, safeSlug, label))
   82 | 
   83 |   const requirementsForCategory = (Array.isArray(requirements) ? requirements : [])
   84 |     .filter((r) => matchesCategory(r?.category || r?.industry || r?.product, safeSlug, label))
   85 | 
   86 |   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
   87 | 
   88 |   const avgMoq = average([
   89 |     ...productsForCategory.map((p) => parseNumber(p?.moq)),
   90 |     ...requirementsForCategory.map((r) => parseNumber(r?.moq || r?.quantity)),
   91 |   ])
   92 | 
   93 |   const avgLeadTime = average([
   94 |     ...productsForCategory.map((p) => parseNumber(p?.lead_time_days)),
   95 |     ...requirementsForCategory.map((r) => parseNumber(r?.timeline_days || r?.delivery_timeline)),
   96 |   ])
   97 | 
   98 |   const topCountries = requirementsForCategory.reduce((acc, req) => {
   99 |     const buyer = usersById.get(String(req?.buyer_id || ''))
  100 |     const country = sanitizeString(buyer?.profile?.country || 'Unknown', 80) || 'Unknown'
  101 |     acc[country] = (acc[country] || 0) + 1
  102 |     return acc
  103 |   }, {})
  104 | 
  105 |   const topCountryList = Object.entries(topCountries)
  106 |     .sort((a, b) => b[1] - a[1])
  107 |     .slice(0, 5)
  108 |     .map(([country, count]) => ({ country, count }))
  109 | 
  110 |   const topProducts = productsForCategory
  111 |     .slice()
  112 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  113 |     .slice(0, 6)
  114 |     .map((p) => {
  115 |       const company = usersById.get(String(p?.company_id || ''))
  116 |       return {
  117 |         id: p.id,
  118 |         title: p.title || 'Product',
  119 |         category: p.category || '',
  120 |         moq: p.moq || '',
  121 |         lead_time_days: p.lead_time_days || '',
  122 |         company_id: p.company_id,
  123 |         company_name: company?.name || '',
  124 |         verified: Boolean(company?.verified),
  125 |       }
  126 |     })
  127 | 
  128 |   const latestRequests = requirementsForCategory
  129 |     .slice()
  130 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  131 |     .slice(0, 6)
  132 |     .map((r) => {
  133 |       const buyer = usersById.get(String(r?.buyer_id || ''))
  134 |       return {
  135 |         id: r.id,
  136 |         title: r.title || r.category || 'Buyer request',
  137 |         category: r.category || '',
  138 |         quantity: r.quantity || '',
  139 |         moq: r.moq || '',
  140 |         price_range: r.price_range || '',
  141 |         buyer_id: r.buyer_id,
  142 |         buyer_name: buyer?.name || '',
  143 |         buyer_verified: Boolean(buyer?.verified),
  144 |         created_at: r.created_at,
  145 |       }
  146 |     })
  147 | 
  148 |   return {
  149 |     slug: safeSlug,
  150 |     category: label,
  151 |     counts: {
  152 |       products: productsForCategory.length,
  153 |       requests: requirementsForCategory.length,
  154 |     },
  155 |     stats: {
  156 |       average_moq: avgMoq,
  157 |       average_lead_time_days: avgLeadTime,
  158 |       top_countries: topCountryList,
  159 |     },
  160 |     top_products: topProducts,
  161 |     latest_requests: latestRequests,
  162 |     categories,
  163 |   }
  164 | }
  165 | 
  166 | 