import { createProduct, listProducts } from '../services/productService.js'

export async function postProduct(req, res) {
  const row = await createProduct(req.user, req.body)
  return res.status(201).json(row)
}

export async function getProducts(req, res) {
  return res.json(await listProducts({ category: req.query.category }))
}


export async function searchProducts(req, res) {
  const all = await listProducts({})
  const q = String(req.query.q || '').toLowerCase().trim()
  const results = all.filter((p) => {
    if (q && !`${p.title} ${p.category} ${p.material} ${p.description}`.toLowerCase().includes(q)) return false
    if (req.query.category && String(p.category).toLowerCase() !== String(req.query.category).toLowerCase()) return false
    return true
  })
  return res.json(results)
}
