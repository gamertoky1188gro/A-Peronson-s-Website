const rules = [
  { check: /setup|onboarding|profile/i, response: 'Start with onboarding: profile image, organization name, and category selection.' },
  { check: /verification|badge/i, response: 'Submit required verification documents, keep premium active, then request admin approval.' },
  { check: /subscription|premium/i, response: 'Premium unlocks higher visibility and advanced analytics for your account type.' },
  { check: /help|support/i, response: 'I can route you to Help Center and suggest next dashboard actions.' },
]

export function assistantReply(question = '') {
  const hit = rules.find((r) => r.check.test(question))
  if (hit) return { mode: 'rule_match', message: hit.response }
  return { mode: 'forward_to_agent', message: 'I will forward this to a human agent for detailed assistance.' }
}
