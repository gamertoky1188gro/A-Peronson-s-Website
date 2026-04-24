import { updateProfile } from "../services/userService.js";

export async function submitOnboarding(req, res) {
  const patch = {
    profile_image: req.body?.profile_image || "",
    organization_name: req.body?.organization_name || "",
    categories: Array.isArray(req.body?.categories) ? req.body.categories : [],
    onboarding_completed: "true",
  };
  const user = await updateProfile(req.user.id, patch);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
}
