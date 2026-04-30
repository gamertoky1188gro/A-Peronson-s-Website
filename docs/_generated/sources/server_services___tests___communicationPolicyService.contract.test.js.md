    1 | import test from 'node:test'
    2 | import assert from 'node:assert/strict'
    3 | 
    4 | import { evaluatePolicyContract } from '../communicationPolicyService.js'
    5 | 
    6 | function baseConfig() {
    7 |   return {
    8 |     message_caps: { outbound_per_window: 3, window_minutes: 15, cooldown_seconds: 45 },
    9 |     priority_multipliers: { premium: 1.2, verified: 1.3 },
   10 |     strictness_mode: 'balanced',
   11 |     spam_thresholds: { queue: 0.4, hard_block: 0.75 },
   12 |   }
   13 | }
   14 | 
   15 | function recentMessage(senderId, matchId, text = 'hello') {
   16 |   return {
   17 |     sender_id: senderId,
   18 |     match_id: matchId,
   19 |     message: text,
   20 |     timestamp: new Date().toISOString(),
   21 |   }
   22 | }
   23 | 
   24 | test('verified sender is delayed (not rejected) on burst frequency limits', () => {
   25 |   const config = baseConfig()
   26 |   const messages = [
   27 |     recentMessage('u-1', 'm-1', 'msg-1'),
   28 |     recentMessage('u-1', 'm-1', 'msg-2'),
   29 |     recentMessage('u-1', 'm-1', 'msg-3'),
   30 |   ]
   31 | 
   32 |   const result = evaluatePolicyContract({
   33 |     sender: { id: 'u-1', verified: true, subscription_status: 'free' },
   34 |     matchId: 'm-1',
   35 |     text: 'new outreach',
   36 |     messages,
   37 |     config,
   38 |     reputationScore: 55,
   39 |   })
   40 | 
   41 |   assert.equal(result.action, 'soft_block')
   42 |   assert.equal(result.reason, 'rate_limit_exceeded')
   43 | })
   44 | 
   45 | test('premium sender gets delayed queue while free sender gets reject under same burst', () => {
   46 |   const config = baseConfig()
   47 |   const messages = [
   48 |     recentMessage('u-2', 'm-2', 'x1'),
   49 |     recentMessage('u-2', 'm-2', 'x2'),
   50 |     recentMessage('u-2', 'm-2', 'x3'),
   51 |   ]
   52 | 
   53 |   const premium = evaluatePolicyContract({
   54 |     sender: { id: 'u-2', verified: false, subscription_status: 'premium' },
   55 |     matchId: 'm-2',
   56 |     text: 'premium burst',
   57 |     messages,
   58 |     config,
   59 |     reputationScore: 55,
   60 |   })
   61 | 
   62 |   const free = evaluatePolicyContract({
   63 |     sender: { id: 'u-2', verified: false, subscription_status: 'free' },
   64 |     matchId: 'm-2',
   65 |     text: 'free burst',
   66 |     messages,
   67 |     config,
   68 |     reputationScore: 55,
   69 |   })
   70 | 
   71 |   assert.equal(premium.action, 'soft_block')
   72 |   assert.equal(free.action, 'soft_block')
   73 |   assert.equal(free.reason, 'rate_limit_exceeded')
   74 | })
   75 | 
   76 | test('new user burst behavior rejects after cap for unverified free users', () => {
   77 |   const config = baseConfig()
   78 |   const messages = [
   79 |     recentMessage('new-user', 'thread', 'm1'),
   80 |     recentMessage('new-user', 'thread', 'm2'),
   81 |     recentMessage('new-user', 'thread', 'm3'),
   82 |   ]
   83 | 
   84 |   const result = evaluatePolicyContract({
   85 |     sender: { id: 'new-user', verified: false, subscription_status: 'free' },
   86 |     matchId: 'thread',
   87 |     text: 'another message in same window',
   88 |     messages,
   89 |     config,
   90 |     reputationScore: 30,
   91 |   })
   92 | 
   93 |   assert.equal(result.action, 'soft_block')
   94 |   assert.equal(result.reason, 'rate_limit_exceeded')
   95 |   assert.equal(result.retryAfterSeconds, 45)
   96 | })
   97 | 
   98 | test('multilingual spam patterns trigger human review', () => {
   99 |   const config = baseConfig()
  100 |   const result = evaluatePolicyContract({
  101 |     sender: { id: 'ml-spam', verified: false, subscription_status: 'free' },
  102 |     matchId: 'm-4',
  103 |     text: 'বিনামূল্যে অফার! এখন যোগাযোগ করুন telegram t.me/example 免费点击',
  104 |     messages: [],
  105 |     config,
  106 |     reputationScore: 40,
  107 |   })
  108 | 
  109 |   assert.equal(result.action, 'hard_block')
  110 |   assert.equal(result.reason, 'spam_hard_block')
  111 | })
  112 | 