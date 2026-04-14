    1 | import { getAdminCatalog } from '../services/adminCatalogService.js'
    2 | 
    3 | export async function adminCatalogOverview(req, res) {
    4 |   const catalog = await getAdminCatalog()
    5 |   return res.json(catalog)
    6 | }
    7 | 