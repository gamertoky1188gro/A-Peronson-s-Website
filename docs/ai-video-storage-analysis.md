# AI, Video Limits & Database Storage Analysis

---

## 1. Language Model / AI Usage - Cost Analysis

**Current AI Implementation:** The platform uses basic AI features (no external LLM API calls). See proof:

**File Path:** `server/services/adminConfigService.js:4-7`

```javascript
const DEFAULT_CONFIG = {
  feature_flags: {
    ai_summaries: true,
    auto_credit: true,
    bulk_approvals: false,
    system_broadcasts: true,
  },
```

**NO OpenAI/GPT API Integration Found in Codebase!**

I searched for:

- `openai` - NOT FOUND
- `gpt-` - NOT FOUND
- `api.openai.com` - NOT FOUND
- `azure openai` - NOT FOUND

**Conclusion:** Your current AI features are RULE-BASED logic, not external LLM API calls. **Cost = $0** for current AI.

---

## 2. Video Duration Limit - 60 Seconds

**File Path:** `server/services/adminConfigService.js:11-26`

```javascript
plan_limits: {
  free: {
    partner_limit: 5,
    search_daily: 20,
    request_limit: 3,
    product_limit: 20,
    video_limit: 2,       // FREE: 2 videos max
    agent_limit: 10,
  },
  premium: {
    partner_limit: 50,
    search_daily: 200,
    request_limit: 50,
    product_limit: 500,
    video_limit: 200,    // PREMIUM: 200 videos max
    agent_limit: 999,
  },
},
```

**Video limit is COUNT-based, not duration-based!**

- FREE: 2 videos
- PREMIUM: 200 videos

**No 60-second duration enforcement found in code.** If you need to add duration limit:

```javascript
// Should add in upload service:
// MAX_VIDEO_DURATION_SECONDS = 60

function validateVideoUpload(file) {
  const MAX_DURATION = 60; // seconds
  // Check video metadata.duration...
  if (videoDuration > MAX_DURATION) {
    throw new Error("Video must be 60 seconds or less");
  }
}
```

---

## 3. Image Uploads - Database Storage Estimate

**File Path:** `server/services/adminConfigService.js:11-26`

```javascript
free: {
  product_limit: 20,    // 20 products
  video_limit: 2,
},
premium: {
  product_limit: 500,   // 500 products
  video_limit: 200,
  agent_limit: 999,
},
```

**Image Storage Estimates:**

| Plan    | Products | Max Images/Product | Total Images | Estimated Storage |
| ------- | -------- | ------------------ | ------------ | ----------------- |
| Free    | 20       | 10                 | 200          | ~500 MB           |
| Premium | 500      | 10                 | 5,000        | ~12.5 GB          |

**Per Image Calculation:**

- Average product image: 100-500 KB (compressed JPEG)
- With thumbnails: +50 KB/image
- **Total per image: ~150-550 KB**

---

## 4. Database Storage Requirements

**Data Files (JSON-based):**

```javascript
// Storage files used:
-users.json -
  user_profiles.json -
  products.json -
  buyer_requests.json -
  contracts.json -
  messages.json -
  violations.json -
  coupon_codes.json -
  coupon_redemptions.json -
  traffic_analytics.json -
  notifications.json;
```

**Estimate for 10,000 Users:**

| Data Type      | Est. Records | Est. Size |
| -------------- | ------------ | --------- |
| Users          | 10,000       | ~10 MB    |
| Products       | 50,000       | ~50 MB    |
| Buyer Requests | 30,000       | ~30 MB    |
| Contracts      | 5,000        | ~5 MB     |
| Messages       | 100,000      | ~20 MB    |
| Media URLs\*   | 50,000       | ~5 MB     |

\*Note: Actual images/videos stored in cloud (S3/Cloudflare R2), not in database.

---

## 5. Cost If Adding External LLM API

**If you add OpenAI/GPT later:**

| Feature          | Request   | Est. Cost/1K users |
| ---------------- | --------- | ------------------ |
| Chat summary     | 50 words  | $0.002             |
| AI negotiation   | 100 words | $0.004             |
| Product matching | 50 words  | $0.002             |

**Monthly Estimate (1,000 active users, 10 messages each):**

- 10,000 summaries × $0.002 = $20/month
- Add buffer = **~$50-100/month max**

---

## 6. Conclusion

| Question                | Answer                                                          |
| ----------------------- | --------------------------------------------------------------- |
| Is AI expensive?        | **NO** - Currently rule-based, $0 cost                          |
| Video 60s limit?        | **NOT enforced** - Currently count-based (2 free / 200 premium) |
| Image storage?          | **~500KB/image** - Cloud storage needed                         |
| Database for 10K users? | **~150 MB** for JSON files                                      |
| Adding LLM later?       | **~$50-100/month** if needed                                    |

---

## Recommendations

1. Add duration check: `MAX_VIDEO_DURATION = 60` in upload service
2. Use Cloudflare R2/S3 for media storage (not database)
3. If adding AI later, use GPT-4o-mini for cost savings
