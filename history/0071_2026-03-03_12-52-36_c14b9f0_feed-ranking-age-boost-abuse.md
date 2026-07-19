# Commit 0071: Enhance Feed Ranking with Age Boost Guardrails and Abuse Signals

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0071                                       |
| Hash          | `c14b9f0c08fe33185c127ebc5e2690e5537f1f53` |
| Parent Hash   | `6d007405783de9ffdb6e5796406de2fe21790bc8` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-03 12:52:36                        |
| Files Changed | 1                                          |
| Additions     | 106                                        |
| Deletions     | 3                                          |
| Net Change    | +103                                       |
| Merge         | No                                         |

## Custom Title

Implement Anti-Abuse Signals and Account Age Guardrails in Feed Ranking

## High-Level Summary

This commit significantly upgrades the feed ranking algorithm in `feedService.js` with anti-abuse protections. It adds spam detection (keyword matching against a list of 9 spam trigger words, duplicate content ratio checks, word variety analysis), rapid posting detection (posts within a 2-hour window), and a minimum account age requirement (1 hour) before age boost applies. The `itemsByAuthor` aggregation is refactored to store full item objects instead of just IDs, enabling content analysis across an author's posts. The ranking snapshot now includes `author_id` and `created_at` for debugging.

## File-by-File Breakdown

### server/services/feedService.js (modified, +106/-3)

- **What changed**: Added `SPAM_KEYWORDS` constant; added 6 new `FEED_BOOST_CONFIG` settings (minimumAccountAgeHours, abuseRapidWindowMinutes, abuseRapidMaxPosts, spamKeywordLimit, spamDuplicateRatioLimit, spamMinWordVarietyRatio); added `normalizeContent`, `evaluateSpamPattern`, `evaluateRepeatedPosting`, `evaluateAntiAbuseSignals` functions; updated `getCombinedFeed` to analyze author items for abuse signals; added account age eligibility check; added anti-abuse fields to `feed_metadata`; enhanced ranking snapshot with `author_id` and `created_at`.
- **Why it matters**: Protects the feed from spam, rapid posting abuse, and ensures age boost only applies to accounts old enough to be trustworthy.

## Detailed Diff Analysis

### Functions/Classes Added

- **`normalizeContent`** — Lowercases and normalizes item title + description for content analysis
- **`evaluateSpamPattern`** — Checks keyword hits (against 9 trigger words), duplicate content ratio, and word variety ratio; marks as low-quality spam if thresholds exceeded
- **`evaluateRepeatedPosting`** — Counts posts within a configurable rapid window (default 2 hours); flags if count exceeds max (default 3)
- **`evaluateAntiAbuseSignals`** — Combines spam and repeated posting checks into a single `antiAbusePassed` boolean

### Logic Changes

- **itemsByAuthor refactored**: Previously stored `item.id` arrays; now stores full item objects, enabling content analysis
- **Age boost guardrail**: Added `minimumAccountAgeHours` (default 1); accounts younger than this are ineligible for age boost
- **Anti-abuse eligibility**: In addition to profile completeness, verified contact, and activity quality, items must pass anti-abuse checks to get the age boost
- **Spam keywords**: 9 trigger words: `whatsapp`, `telegram`, `dm`, `discount`, `cheap`, `guarantee`, `click`, `urgent`, `100%`
- **Ranking snapshot enriched**: Includes `author_id` and `created_at` for each ranked item

### New Config Values (all via env vars)

- `FEED_BOOST_MIN_ACCOUNT_AGE_HOURS` (default 1)
- `FEED_ABUSE_RAPID_WINDOW_MINUTES` (default 120)
- `FEED_ABUSE_RAPID_MAX_POSTS` (default 3)
- `FEED_SPAM_KEYWORD_LIMIT` (default 3)
- `FEED_SPAM_DUPLICATE_RATIO_LIMIT` (default 0.5)
- `FEED_SPAM_MIN_WORD_VARIETY` (default 0.35)

## Why This Change May Have Been Needed

Without these protections, the feed was vulnerable to spam campaigns, bot posting, and account farming for age boost manipulation. The anti-abuse signals prevent low-quality content from being boosted and protect user trust in the feed.

## Was It Useful?

**Very useful.** These are essential moderation features for any content feed platform. The configurable thresholds via env vars allow tuning without code changes.

## Impact Analysis

- **Developers**: New feed metadata fields: `account_age_eligible`, `suspicious_repeated_posting`, `posts_in_rapid_window`, `low_quality_spam`, `spam_keyword_hits`, `duplicate_content_ratio`, `word_variety_ratio`.
- **Users**: New accounts must wait 1 hour before age boost applies. Spam content is deprioritized in the feed.
- **Backward compatibility**: Fully backward compatible — all new thresholds have sensible defaults.

## Relationship to Surrounding Commits

Follows the ratings lifecycle merge (0070) and precedes merge PR #38. The anti-abuse infrastructure prepares for more sophisticated feed management.

## Confidence Notes

High. Single-file change with clear, well-structured functions and extensive config defaults.

## Optional Technical Details

- `SPAM_KEYWORDS` list is hardcoded but thresholds are configurable via env
- Word variety ratio compared against `FEED_SPAM_MIN_WORD_VARIETY` (default 0.35 = 35% unique words minimum)
- Rapid posting window default is 2 hours
- Items where `antiAbusePassed` is false are still shown but do not receive the age boost multiplier
