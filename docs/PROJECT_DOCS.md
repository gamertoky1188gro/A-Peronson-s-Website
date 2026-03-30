# GarTexHub Project Documentation (MVP)

## 1) Overview
GarTexHub is a B2B marketplace focused on garments and textiles. It connects Buyers, Factories, and Buying Houses in a structured workflow with verified profiles, secure communication, and contract storage.

Goals:
- Reduce fraud with verification, payment proofs, and contact-sharing restrictions.
- Keep workflow simple for business users.
- Provide clear analytics for owners and enterprise buyers.

## 2) Account Types
- Buyer: posts buyer requests, manages contracts, reviews suppliers.
- Factory: posts products, receives buyer requests, manages contracts.
- Buying House: manages multiple agents, handles buyer requests, coordinates partner factories.
- Admin/Owner: system oversight, moderation, verification approvals.

## 3) Core Modules
### 3.1 Buyer Request System
- Garments vs Textile request types (different fields).
- Full structured specs + commercial + compliance fields.
- Optional custom fields + custom description.
- Verified-only toggle per request (strict).
- Attachments (tech pack, sketches, compliance).

### 3.2 Product Posting
- Factory + Buying House can post products.
- Image uploads + internal video uploads.
- Video moderation workflow (pending ? approved).
- Product views tracked for analytics and “viewed history”.

### 3.3 Messaging & Contact Control
- Verified suppliers: direct inbox.
- Unverified: message requests.
- Buying House internal agent lock (prevents team clash).
- Strict contact-sharing block (auto delete + warnings + restrictions).

### 3.4 Verification
Verification is subscription-based and requires documents per role:
- Factory: Company Registration, Trade License, TIN, Authorized NID, Bank Proof, ERC.
- Buying House: Company Registration, Trade License, TIN, Authorized NID, Bank Proof.
- Buyer (EU): Company Registration, VAT, EORI, Bank Proof.
- Buyer (USA): Company Registration, EIN, IOR, Bank Proof.

Optional licenses can be added to increase credibility.

Pricing:
- First month: $1.99
- Renewal: $6.99/month

Verification expires if renewal fails.

### 3.5 Contracts & Payment Proofs
- Digital contracts stored in Contract Vault (PDF stored for both parties).
- Bank/LC proof workflow tied to contracts.
- Seller review + internal dispute resolution.
- Contract signing requires accepted payment proof.

### 3.6 Analytics (Enterprise)
Owner/Marketplace metrics:
- Buyer?Supplier Match Rate
- Active Buyer vs Supplier Ratio
- Request?Contract Conversion
- Time to First Qualified Response
- Repeat Buyer Rate

Buying House/Factory metrics:
- Buyer Request Match Rate
- Lead?Deal Conversion
- Response Speed
- Buyer Demand Trend
- Trusted Deal Score

### 3.7 Tracking (MVP)
Backend tracking logs:
- page_view
- click
- page_duration / session_end

Insights summary shows:
- Total views
- Total clicks
- Avg session duration
- Top pages

## 4) Wallet & Credits
- New accounts automatically receive $5 restricted credit.
- Restricted credit can be used only for verification/subscription.

## 5) Moderation & Safety
- Contact sharing blocked (email/phone/social handles) with warnings and escalating restrictions.
- Comment/report flows for feed items.
- Admin review for verification + payment disputes.

## 6) UI / UX Principles
- LinkedIn-style professional layout.
- Simplified garment/textile categories.
- Floating AI assistant to guide settings.
- Minimal clutter, clear hierarchy, strong verified cues.

## 7) Data Storage (MVP)
JSON files used for rapid MVP:
- users.json
- requirements.json
- company_products.json
- messages.json
- verification.json
- documents.json
- analytics.json

## 8) Known Next Steps
- Dedicated full analytics report pages.
- External payment gateway integration.
- Expanded enterprise automation + advanced reporting.

---
This document summarizes current MVP scope and workflow as implemented.


## 9) Launch & Marketing Readiness (Paid Launch)
Minimum UI readiness checklist:
- Login/signup stable
- Feed/search works
- Chat + call stable
- Profile pages readable
- Support/contact available

Go/No-Go checklist:
- All above UI checks pass
- Error rate monitored on key flows
- Support queue active with SLA targets
- Coupon redemption tested for premium activation

Update cadence:
- Weekly update summary (features shipped + known issues)
- Monthly premium roadmap update

Marketing FAQ (internal):
- What is live now: core buyer requests, profiles, messaging, contracts, verification, analytics, boosts.
- What is in progress: dedicated support workflow, account manager assignment, order completion certification, expanded insights.

Payment promo policy:
- Coupon-only premium activation is allowed (card optional if coupon does not require card).
- Card is required only when no coupon is used.

Stakeholder response draft (for updates):
Hi Shaun, this is Cyber Code Master.

আপনার সব প্রশ্ন একসাথে পরিষ্কারভাবে উত্তর দিলাম:

1) “customaiz option থাকা যেতে পারে”
হ্যাঁ। Customization option আছে।
Premium প্ল্যানে Org Settings > Branding এবং AI Auto-Reply customization আছে। এটা implement করা আছে।

2) “account delete option দরকার, password দিয়ে delete করা যাবে”
হ্যাঁ, implement করা আছে।
User নিজের password দিয়ে account delete করতে পারে (Org Settings > Security/Account area)।
এটা live কাজ করছে।

3) “বাস্তবায়িত?”
যেগুলো বর্তমানে কাজ করছে (MVP-তে):
- Advanced Search Filters (Premium gatingসহ)
- Priority Buyer Request Placement
- AI Auto-Reply customization
- Smart Supplier Matching
- Contract History / Audit Trail (ডকুমেন্ট/contract ট্রেইল)
- Early Access to verified factories
- Profile & Product boost
- Analytics/Insights dashboard
- Custom branding (Premium)

আর যেগুলো plan/in-progress:
- Dedicated Support / Account Manager workflow
- Order Completion Certification
- Buying Pattern Analysis (উন্নত version)
- Enterprise-grade export/reporting polish
