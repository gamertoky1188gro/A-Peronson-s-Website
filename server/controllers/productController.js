import { createProduct, listProducts } from '../services/productService.js'

export async function postProduct(req, res) {
  const row = await createProduct(req.user, req.body)
  return res.status(201).json(row)
}

export async function getProducts(req, res) {
  return res.json(await listProducts({ category: req.query.category }))
}
