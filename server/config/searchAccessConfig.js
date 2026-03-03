export const FILTER_TIERS = {
  basic: ['q', 'category'],
  advanced: ['primary', 'moqRange', 'country', 'verifiedOnly', 'orgType'],
}

export const PLAN_DAILY_LIMITS = {
  free: {
    requirements_search: 25,
    products_search: 25,
    search_alerts_create: 5,
  },
  premium: {
    requirements_search: 400,
    products_search: 400,
    search_alerts_create: 100,
  },
}

export const PLAN_FILTER_ACCESS = {
  free: {
    allowedTiers: ['basic'],
  },
  premium: {
    allowedTiers: ['basic', 'advanced'],
  },
}
