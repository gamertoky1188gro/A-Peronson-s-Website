    1 | import test from 'node:test'
    2 | import assert from 'node:assert/strict'
    3 | 
    4 | import { ACTIONS, authorize, buildCapabilityPayload } from '../authorizationService.js'
    5 | 
    6 | function actor(overrides = {}) {
    7 |   return {
    8 |     id: 'u-1',
    9 |     role: 'owner',
   10 |     subscription_status: 'premium',
   11 |     profile: { team: 'alpha', sub_team: 'east' },
   12 |     ...overrides,
   13 |   }
   14 | }
   15 | 
   16 | test('denies cross-role action: agent cannot assign leads', async () => {
   17 |   const agent = actor({ id: 'agent-1', role: 'agent', org_owner_id: 'org-1' })
   18 |   await assert.rejects(
   19 |     () => authorize(agent, ACTIONS.LEADS_ASSIGN, { lead_id: 'lead-1' }),
   20 |     /cannot perform leads.assign/,
   21 |   )
   22 | })
   23 | 
   24 | test('denies advanced filters for free plan', async () => {
   25 |   const freeBuyer = actor({ role: 'buyer', subscription_status: 'free' })
   26 |   await assert.rejects(
   27 |     () => authorize(freeBuyer, ACTIONS.FILTERS_ADVANCED_ACCESS, {}),
   28 |     /Advanced filters require premium\/enterprise plan/,
   29 |   )
   30 | })
   31 | 
   32 | test('allows enterprise member management flow under seat cap', async () => {
   33 |   const manager = actor({ role: 'admin' })
   34 |   const decision = await authorize(manager, ACTIONS.MEMBERS_MANAGE, {
   35 |     org_id: 'org-1',
   36 |     active_seats: 4,
   37 |     requested_seats: 1,
   38 |     seat_cap: 10,
   39 |   })
   40 |   assert.equal(decision.allowed, true)
   41 |   assert.equal(decision.action, ACTIONS.MEMBERS_MANAGE)
   42 | })
   43 | 
   44 | test('denies team-restricted analytics outside actor team', async () => {
   45 |   const scopedAgent = actor({ id: 'agent-7', role: 'agent', org_owner_id: 'org-7', profile: { team: 'alpha', sub_team: 'east' } })
   46 |   await assert.rejects(
   47 |     () => authorize(scopedAgent, ACTIONS.ANALYTICS_VIEW_AGENT, { team: 'beta', sub_team: 'west', target_agent_id: 'agent-7' }),
   48 |     /Restricted visibility outside your team\/sub-team/,
   49 |   )
   50 | })
   51 | 
   52 | test('capability payload exposes module matrix', () => {
   53 |   const capabilities = buildCapabilityPayload(actor({ role: 'factory' }))
   54 |   assert.equal(capabilities.leads.assign, true)
   55 |   assert.equal(capabilities.filters.advanced_access, true)
   56 |   assert.equal(capabilities.members.manage, true)
   57 | })
   58 | 