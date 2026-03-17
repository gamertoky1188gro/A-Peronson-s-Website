    1 | import { updateProfile } from '../services/userService.js'
    2 | 
    3 | export async function submitOnboarding(req, res) {
    4 |   const patch = {
    5 |     profile_image: req.body?.profile_image || '',
    6 |     organization_name: req.body?.organization_name || '',
    7 |     categories: Array.isArray(req.body?.categories) ? req.body.categories : [],
    8 |     onboarding_completed: 'true',
    9 |   }
   10 |   const user = await updateProfile(req.user.id, patch)
   11 |   if (!user) return res.status(404).json({ error: 'User not found' })
   12 |   return res.json(user)
   13 | }
   14 | 