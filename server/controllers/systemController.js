export async function systemMeta(req, res) {
  return res.json({
    name: 'GarTexHub',
    version: 'enterprise-ux-mvp',
    modules: [
      'auth',
      'onboarding',
      'buyer_requests',
      'company_products',
      'combined_feed',
      'assistant_guidance',
      'conversation_lock',
      'verification',
      'subscriptions',
      'analytics',
    ],
    design: 'LinkedIn-style professional blue/white trust interface',
  })
}
