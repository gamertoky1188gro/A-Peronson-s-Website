import { listRequirements } from './requirementService.js'
import { listProducts } from './productService.js'

const CATEGORIES = ['Shirts', 'Knitwear', 'Denim', 'Women', 'Kids']

export async function getCombinedFeed({ unique = false, type = 'all', category = '' }) {
  const requests = type === 'products' ? [] : await listRequirements({ status: 'open' })
  const products = type === 'requests' ? [] : await listProducts({ category })

  let combined = [
    ...requests.map((r) => ({ ...r, feed_type: 'buyer_request', icon: '💼' })),
    ...products.map((p) => ({ ...p, feed_type: 'company_product', icon: '🏭' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  if (unique) {
    combined = combined.filter((item, idx) => idx % 2 === 0 || CATEGORIES.some((c) => String(item.category || '').toLowerCase().includes(c.toLowerCase())))
  }

  return { tags: CATEGORIES, unique, items: combined }
}
