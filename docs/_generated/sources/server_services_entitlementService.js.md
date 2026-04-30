    1 | import { getSubscription } from './subscriptionService.js'
    2 | import { forbiddenError } from '../utils/permissions.js'
    3 | 
    4 | const PREMIUM_FEATURES_BY_ROLE = {
    5 |   buyer: [
    6 |     'advanced_search_filters',
    7 |     'priority_buyer_request_placement',
    8 |     'dedicated_support',
    9 |     'contract_history_audit',
   10 |     'early_access_verified_factories',
   11 |     'buying_pattern_analysis',
   12 |     'order_completion_certification',
   13 |     'ai_auto_reply_customization',
   14 |     'smart_supplier_matching',
   15 |     'request_performance_insights',
   16 |     'profile_boost',
   17 |     'product_boost',
   18 |   ],
   19 |   factory: [
   20 |     'profile_boost',
   21 |     'product_boost',
   22 |     'advanced_analytics',
   23 |     'priority_search_ranking',
   24 |     'ai_auto_reply_customization',
   25 |     'dedicated_account_manager',
   26 |     'custom_branding',
   27 |     'enterprise_analytics_dashboard',
   28 |     'unlimited_agents',
   29 |     'buying_pattern_analysis',
   30 |     'order_completion_certification',
   31 |     'dedicated_support',
   32 |     'contract_history_audit',
   33 |     'multi_agent_management',
   34 |     'team_access_management',
   35 |     'request_performance_insights',
   36 |     'buyer_interest_analytics',
   37 |     'agent_performance_analytics',
   38 |     'product_video_capacity',
   39 |     'lead_distribution',
   40 |     'buyer_communication_insights',
   41 |     'buyer_request_priority_access',
   42 |     'buyer_conversion_insights',
   43 |     'unlimited_partner_accept',
   44 |   ],
   45 |   buying_house: [
   46 |     'profile_boost',
   47 |     'product_boost',
   48 |     'advanced_analytics',
   49 |     'priority_search_ranking',
   50 |     'ai_auto_reply_customization',
   51 |     'dedicated_account_manager',
   52 |     'custom_branding',
   53 |     'enterprise_analytics_dashboard',
   54 |     'unlimited_agents',
   55 |     'buying_pattern_analysis',
   56 |     'order_completion_certification',
   57 |     'dedicated_support',
   58 |     'contract_history_audit',
   59 |     'multi_agent_management',
   60 |     'team_access_management',
   61 |     'request_performance_insights',
   62 |     'buyer_interest_analytics',
   63 |     'agent_performance_analytics',
   64 |     'product_video_capacity',
   65 |     'lead_distribution',
   66 |     'buyer_communication_insights',
   67 |     'buyer_request_priority_access',
   68 |     'buyer_conversion_insights',
   69 |     'unlimited_partner_access',
   70 |   ],
   71 | }
   72 | 
   73 | function normalizeRole(role) {
   74 |   const raw = String(role || '').toLowerCase()
   75 |   if (raw === 'buying_house' || raw === 'buying house') return 'buying_house'
   76 |   if (raw === 'factory') return 'factory'
   77 |   if (raw === 'buyer') return 'buyer'
   78 |   return raw
   79 | }
   80 | 
   81 | export async function getPlanForUser(user) {
   82 |   if (!user) return 'free'
   83 |   const sub = await getSubscription(user.id)
   84 |   if (sub?.plan === 'premium') return 'premium'
   85 |   return String(user?.subscription_status || '').toLowerCase() === 'premium' ? 'premium' : 'free'
   86 | }
   87 | 
   88 | export async function isPremiumUser(user) {
   89 |   const plan = await getPlanForUser(user)
   90 |   return plan === 'premium'
   91 | }
   92 | 
   93 | export async function getEntitlements(user) {
   94 |   const role = normalizeRole(user?.role)
   95 |   const plan = await getPlanForUser(user)
   96 |   const premium = plan === 'premium'
   97 |   const premiumFeatures = PREMIUM_FEATURES_BY_ROLE[role] || []
   98 |   const featureMap = Object.fromEntries(premiumFeatures.map((feature) => [feature, premium]))
   99 | 
  100 |   return {
  101 |     role,
  102 |     plan,
  103 |     premium,
  104 |     premium_features: premiumFeatures,
  105 |     features: featureMap,
  106 |   }
  107 | }
  108 | 
  109 | export async function ensureEntitlement(user, feature, message = '') {
  110 |   const entitlements = await getEntitlements(user)
  111 |   if (entitlements?.features?.[feature]) return entitlements
  112 |   const err = forbiddenError(message || 'Premium plan required')
  113 |   err.code = 'PREMIUM_REQUIRED'
  114 |   err.feature = feature
  115 |   throw err
  116 | }
  117 | 
  118 | 