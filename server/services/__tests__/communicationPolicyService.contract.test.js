import test from 'node:test'
import assert from 'node:assert/strict'

import { evaluatePolicyContract } from '../communicationPolicyService.js'

function baseConfig() {
  return {
    max_outreach_per_window: 3,
    outreach_window_minutes: 15,
    cooldown_seconds: 45,
    premium_boost: 20,
    verified_boost: 30,
    keyword_risk_threshold_soft: 0.4,
    keyword_risk_threshold_hard: 0.75,
  }
}

function recentMessage(senderId, matchId, text = 'hello') {
  return {
    sender_id: senderId,
    match_id: matchId,
    message: text,
    timestamp: new Date().toISOString(),
  }
}

test('verified sender is delayed (not rejected) on burst frequency limits', () => {
  const config = baseConfig()
  const messages = [
    recentMessage('u-1', 'm-1', 'msg-1'),
    recentMessage('u-1', 'm-1', 'msg-2'),
    recentMessage('u-1', 'm-1', 'msg-3'),
  ]

  const result = evaluatePolicyContract({
    sender: { id: 'u-1', verified: true, subscription_status: 'free' },
    matchId: 'm-1',
    text: 'new outreach',
    messages,
    config,
    trustScore: 55,
  })

  assert.equal(result.action, 'delayed_queue')
  assert.equal(result.reason, 'frequency_limit_boosted')
})

test('premium sender gets delayed queue while free sender gets reject under same burst', () => {
  const config = baseConfig()
  const messages = [
    recentMessage('u-2', 'm-2', 'x1'),
    recentMessage('u-2', 'm-2', 'x2'),
    recentMessage('u-2', 'm-2', 'x3'),
  ]

  const premium = evaluatePolicyContract({
    sender: { id: 'u-2', verified: false, subscription_status: 'premium' },
    matchId: 'm-2',
    text: 'premium burst',
    messages,
    config,
    trustScore: 55,
  })

  const free = evaluatePolicyContract({
    sender: { id: 'u-2', verified: false, subscription_status: 'free' },
    matchId: 'm-2',
    text: 'free burst',
    messages,
    config,
    trustScore: 55,
  })

  assert.equal(premium.action, 'delayed_queue')
  assert.equal(free.action, 'reject')
  assert.equal(free.reason, 'frequency_limit')
})

test('new user burst behavior rejects after cap for unverified free users', () => {
  const config = baseConfig()
  const messages = [
    recentMessage('new-user', 'thread', 'm1'),
    recentMessage('new-user', 'thread', 'm2'),
    recentMessage('new-user', 'thread', 'm3'),
  ]

  const result = evaluatePolicyContract({
    sender: { id: 'new-user', verified: false, subscription_status: 'free' },
    matchId: 'thread',
    text: 'another message in same window',
    messages,
    config,
    trustScore: 30,
  })

  assert.equal(result.action, 'reject')
  assert.equal(result.reason, 'frequency_limit')
  assert.equal(result.retryAfterSeconds, 45)
})

test('multilingual spam patterns trigger human review', () => {
  const config = baseConfig()
  const result = evaluatePolicyContract({
    sender: { id: 'ml-spam', verified: false, subscription_status: 'free' },
    matchId: 'm-4',
    text: 'বিনামূল্যে অফার! এখন যোগাযোগ করুন telegram t.me/example 免费点击',
    messages: [],
    config,
    trustScore: 40,
  })

  assert.equal(result.action, 'require_human_review')
  assert.equal(result.reason, 'keyword_risk_hard')
})
