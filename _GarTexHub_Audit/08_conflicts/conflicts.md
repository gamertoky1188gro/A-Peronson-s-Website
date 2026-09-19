# 08 — Cross-Message Consistency & Conflict Analysis

**Source:** WhatsApp Chat with GarTexHub B2B Marketplace
**Analysis Date:** 2026-09-18
**Total Findings:** 28

---

## CONFLICT-01: Backend Technology — Express.js → Prisma → NestJS

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-01 |
| **CHANGE_TYPE** | SUPERSESSION (3 stages) |
| **EARLIER_REQUIREMENT** | 2/15/26 9:57PM — Arnob: "Frontend: React, Backend: Express.js (Node.js)… I plan to develop using my preferred technology stack" (line 8) |
| **MIDDLE_REQUIREMENT** | 2/15/26 9:58PM — Arnob: "Frontend: React, Backend: Prisma" (line 16) |
| **LATER_REQUIREMENT** | 3/4/26 12:21AM — Arnob: "yeah but use nest.js" (line 575); earlier 3/3/26 11:31PM — Arnob: "no, we will use nest" (line 435) |
| **FINAL_KNOWN_POSITION** | NestJS (Node.js framework with Prisma ORM) |
| **EVIDENCE** | Three sequential replacements. Express.js was the initial preference, replaced by "Prisma" (confused — Prisma is an ORM, not a backend framework), then corrected to NestJS. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-02: AI Chatbot — Ollama+Qwen → OpenAI+Gemini (Arnob integration)

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-02 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 3/4/26 12:20AM — Arnob: "use ollama and qwen 2.5" (line 572) |
| **LATER_REQUIREMENT** | 3/4/26 12:50AM — Arnob: "dont integrate ollama; you didn't get. I will later integrate we have open ai api and fallback gemini api. ollama is huge" (lines 597–598) |
| **FINAL_KNOWN_POSITION** | Arnob will integrate OpenAI API + Gemini fallback himself. Mira should NOT integrate Ollama. |
| **EVIDENCE** | Arnob first requested Ollama+Qwen, then 30 minutes later explicitly reversed: "dont integrate ollama" and said he'd handle the AI integration separately. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-03: Database — Firebase Proposed → Rejected → NestJS/Prisma

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-03 |
| **CHANGE_TYPE** | CONTRADICTION / REJECTION |
| **EARLIER_REQUIREMENT** | 3/3/26 11:27AM — Shakibul: "taile firebase use korbo?" (line 432) |
| **LATER_REQUIREMENT** | 3/3/26 11:31PM — Arnob: "no we will use nest" (line 435) |
| **FINAL_KNOWN_POSITION** | No Firebase. NestJS stack (implies Prisma ORM with PostgreSQL or similar). |
| **EVIDENCE** | Shakibul proposed Firebase, Arnob rejected it immediately. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-04: Cloudflare — Planned for Hosting → Abandoned as Too Expensive

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-04 |
| **CHANGE_TYPE** | ABANDONMENT |
| **EARLIER_REQUIREMENT** | 2/15/26 9:58PM — Arnob: "we will use cloudflare/aws" (line 17) |
| **LATER_REQUIREMENT** | 2/21/26 2:12PM — Arnob: "hey we wont use cloudfare. too expensive to handle" (lines 355–356) |
| **FINAL_KNOWN_POSITION** | Cloudflare hosting abandoned. No replacement hosting provider explicitly named (AWS was also mentioned initially but not confirmed). |
| **EVIDENCE** | Design previews were hosted on `trycloudflare.com` URLs. 6 days later Arnob explicitly rejected Cloudflare due to cost. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-05: AI Assistant Purpose — Marketing Tool → FAQ Bot → Onboarding Helper

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-05 |
| **CHANGE_TYPE** | SUPERSESSION (3 stages) |
| **EARLIER_REQUIREMENT** | 2/18/26 2:55PM — Shakibul describes chatbot with customizable factory info, product-marking, professional communication with automation (lines 151–155) |
| **MIDDLE_REQUIREMENT** | 2/18/26 3:21PM — Shakibul: "We will build a normal bot that handles simple conversations… There is no need for a language model… An algorithm will be enough" (lines 159–163) |
| **LATER_REQUIREMENT** | 2/18/26 5:24PM — Shakibul self-corrects: "the AI assistant we currently have is primarily being used to help users create accounts and understand all system account settings… the point about having an assistant for marketing is not really necessary… points I mentioned earlier regarding temporary user input are currently considered unnecessary" (lines 167–171) |
| **FINAL_KNOWN_POSITION** | Simple algorithmic FAQ bot that helps users understand the system during onboarding. No marketing AI. No language model. Will also connect to help center. (Line 224–228) |
| **EVIDENCE** | Shakibul first described a rich chatbot with custom knowledge, then Arnob challenged the value, Shakibul walked back the marketing functionality, then clarified the actual purpose is system-guided onboarding only. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-06: Auto-Call Scheduling from Chatbot → Rejected

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-06 |
| **CHANGE_TYPE** | REJECTION |
| **EARLIER_REQUIREMENT** | 2/18/26 1:49PM — Mira asks: "Should the chatbot automatically schedule calls after collecting basic info from buyer?" (line 142) |
| **LATER_REQUIREMENT** | 2/18/26 2:53PM — Shakibul: "No. They can call if they want, it's their personal matter. Scheduling option can be given, would look nicer" (lines 144–148) |
| **FINAL_KNOWN_POSITION** | Auto-call scheduling rejected. Call is a personal choice. Optional scheduling feature allowed. |
| **EVIDENCE** | Mira's proposed auto-call flow was explicitly rejected by Shakibul. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-07: Video/Reels — Dedicated Tab vs Main Feed

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-07 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 2/16/26 9:24PM — Mira asks about "dedicated Reels or Video Feed tab on the homepage, or videos in the main feed?" (line 25) |
| **MIDDLE_REQUIREMENT** | 2/17/26 10:46AM — Arnob: "separate section" (line 96) |
| **LATER_REQUIREMENT** | 2/17/26 10:54AM — Shakibul: "No need for separate section like YouTube [at the bottom]… but profile can have separate section" (lines 98–99); Arnob confirms "ha" (line 100) |
| **FINAL_KNOWN_POSITION** | No dedicated video tab on homepage. Videos appear in the main feed. Factory profiles have a separate video/gallery section. |
| **EVIDENCE** | Arnob initially said "separate section," then Shakibul clarified no YouTube-style bottom tabs, and Arnob agreed. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-08: Verified User Message Blocking → Changed to Message Requests

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-08 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Referenced in 2/16/26 10:15AM — Shakibul: "Verified user's message blocking others was the plan" (implied earlier design decision) (line 84) |
| **LATER_REQUIREMENT** | 2/16/26 10:15AM — Shakibul: "that won't happen. Verified users can message directly. Unverified users' messages stay as message requests (like Facebook Lite)" (lines 84–87) |
| **FINAL_KNOWN_POSITION** | Verified users: direct messaging. Unverified users: messages go to request queue (Facebook Lite style). No message blocking. |
| **EVIDENCE** | Shakibul explicitly states the original blocking concept won't be implemented and describes the new request-based system. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-09: Profile Boost — Deferred vs Included in Premium

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-09 |
| **CHANGE_TYPE** | CONTRADICTION |
| **EARLIER_REQUIREMENT** | 2/18/26 5:40PM — Shakibul: "No need for boost feature now, will implement in future" (line 177) |
| **LATER_REQUIREMENT** | 2/20/26 9:42PM — Shakibul: "if someone buys premium we will boost their reach, don't mention how much" (lines 268–269); 3/24/26 11:12AM — Premium feature lists include "Profile, products boost & increased reach" for all three account types (lines 780, 789, 845) |
| **FINAL_KNOWN_POSITION** | CONTRADICTORY. Boost was deferred ("future"), then listed as a current Premium feature. The 3/24 premium features document lists boost for all account types. |
| **EVIDENCE** | Direct contradiction between "not now, later" and "it's a premium feature." The 3/24 document appears to be the latest position, but it was never explicitly reconciled with the earlier deferral. |
| **CONFIDENCE** | MEDIUM — Boost appears in the 3/24 feature list, but Shakibul's earlier deferral was never explicitly reversed. |

---

## CONFLICT-10: Subscription Plans — Three Separate vs Universal

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-10 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 3/4/26 4:30PM — Shakibul: "Three types of accounts need three different pricing plans" (line 658) |
| **MIDDLE_REQUIREMENT** | 2/20/26 9:36PM — Shakibul: "No need for specific plans per account type. Show ONE subscription interface: Free + Premium" (lines 254–260) |
| **LATER_REQUIREMENT** | 2/20/26 9:38PM — Shakibul: "But show features based on account type — factory sees their list, others see different" (lines 262–267) |
| **FINAL_KNOWN_POSITION** | One universal subscription page with 2 tiers (Free + Premium). Features shown are account-type-specific within the same page. NOT three separate pricing pages. |
| **EVIDENCE** | Shakibul first said three separate plans, then corrected to one universal interface, then clarified that while the page is universal, the feature lists differ per account type. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-11: Pricing — Deferred → $29/month Decided

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-11 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 2/16/26 9:50PM — Shakibul: "what features to offer… pricing will be set later" (line 77) |
| **LATER_REQUIREMENT** | 6/8/26 10:45AM — Shakibul: "$29/month for all three account types. Yearly $300 (discounted from $348)" (lines 1158–1162) |
| **FINAL_KNOWN_POSITION** | $29/month for all account types. $300/year (discounted from $29×12=$348). |
| **EVIDENCE** | Pricing was initially deferred, then concretely decided 4 months later. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-12: Figma Design — Required → PDF Designs Accepted

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-12 |
| **CHANGE_TYPE** | ABANDONMENT |
| **EARLIER_REQUIREMENT** | 2/15/26 9:58PM — Arnob: "first we need figma design" (line 14, repeated at line 19, 94) |
| **LATER_REQUIREMENT** | 2/20/26 7:42PM — Arnob: "It would be better if you do it in figma" → Mira: "i am good at coding but bad at designing" (lines 242–244). 2/20/26 7:29PM — Arnob: "nice" (line 239) after reviewing PDF designs |
| **FINAL_KNOWN_POSITION** | Figma was never used. PDF-based designs were accepted. The requirement for Figma was effectively abandoned. |
| **EVIDENCE** | Arnob repeatedly demanded Figma. When Mira admitted inability and shared PDFs, Arnob approved the PDFs. No further Figma demands after 2/20. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-13: Signup Page — Features Displayed During Registration

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-13 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Implied: Mira's signup designs showed features during account creation flow |
| **LATER_REQUIREMENT** | 2/20/26 9:29PM — Shakibul: "Showing features during account creation is not right! Nobody does that" (lines 247–248) |
| **FINAL_KNOWN_POSITION** | Signup/onboarding should NOT display feature lists. Keep it clean and simple. |
| **EVIDENCE** | Shakibul explicitly flagged this as wrong UX after reviewing Mira's designs. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-14: Post Editor — Removed Then Requested Back

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-14 |
| **CHANGE_TYPE** | CORRECTION / CONTRADICTION |
| **EARLIER_REQUIREMENT** | Unknown (Shakibul may have previously asked to remove Post Editor feature) |
| **LATER_REQUIREMENT** | 6/2/26 3:14PM — Shakibul: "Post Editor option should be given here. If it was there before and you removed it based on my words, I apologize, sorry" (lines 1139–1141) |
| **FINAL_KNOWN_POSITION** | Post Editor should exist. Shakibul apologizes for potentially causing its removal. |
| **EVIDENCE** | Shakibul himself acknowledges he may have been responsible for removing the feature, then asks for it back. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-15: Rating System — Auto 5-Star Abolished

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-15 |
| **CHANGE_TYPE** | ABANDONMENT |
| **EARLIER_REQUIREMENT** | Referenced in 6/27/26 3:06PM — Shakibul: "We had a system for auto 5-star rating" (line 1187) |
| **LATER_REQUIREMENT** | 6/27/26 3:06PM — Shakibul: "Abolish it. Each person can manually rate or not. We will remind and encourage" (lines 1189–1191) |
| **FINAL_KNOWN_POSITION** | No automatic 5-star ratings. Manual rating only. System should remind/encourage but not auto-assign. |
| **EVIDENCE** | Shakibul explicitly orders the abolition of the auto-rating system. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-16: Industry Selection for Factories — Required Then Cancelled

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-16 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 7/1/26 9:23AM — Shakibul: "Factory accounts must select Textile or Garments" (lines 1583–1588) |
| **LATER_REQUIREMENT** | 7/1/26 10:31AM — Shakibul: "Cancelled. Because if this info leaks, they can contact each other directly since trade licenses include phone numbers" (lines 1589–1593) |
| **FINAL_KNOWN_POSITION** | Industry selection during factory signup cancelled to prevent contact information leakage between parties. |
| **EVIDENCE** | Shakibul required the feature then cancelled it 1 hour later, citing security concerns. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-17: Coupon Code → Auto $5 Credit + Early Adopter Coupon

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-17 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 3/4/26 6:24AM — Shakibul: "If someone creates an account using a specific coupon code, they will receive $5" (line 600) |
| **LATER_REQUIREMENT** | 3/23/26 8:56PM — Shakibul restructures: "All users get auto $5 restricted credit. First 100 early adopter factories/buying houses get coupon + 2 months free verification" (lines 708–746) |
| **FINAL_KNOWN_POSITION** | Two systems: (1) Auto $5 for ALL new users (no coupon needed), (2) Coupon-based benefits for first 100 early adopters (2 months free verification, credit card required). Both can be combined. |
| **EVIDENCE** | Original coupon-only system was replaced by a more comprehensive dual system. Shakibul explicitly says "either auto credit OR coupon-based, no problem" (line 752). |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-18: Member Remove — Single Click vs Password Required

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-18 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Implied: Current system allows one-click member removal |
| **LATER_REQUIREMENT** | 6/1/26 10:51PM — Shakibul: "Remove with one click is wrong. Should require password/passkey + confirm button, then delete" (lines 1027–1029). Repeated at 6/2/26 2:23PM (line 1098). |
| **FINAL_KNOWN_POSITION** | Member removal requires authentication (password/passkey) + confirmation dialog. |
| **EVIDENCE** | Shakibul reports the security flaw twice, emphasizing it must be fixed. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-19: Notification Badge Not Clearing After Viewing

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-19 |
| **CHANGE_TYPE** | CORRECTION (bug report) |
| **EARLIER_REQUIREMENT** | Notification system implemented with badge count |
| **LATER_REQUIREMENT** | 6/1/26 10:59PM — Shakibul: "After viewing notifications, the count still shows on the notification bar. Like YouTube, it should clear after viewing" (lines 1038–1046) |
| **FINAL_KNOWN_POSITION** | Notification badge count must clear after all notifications are viewed. |
| **EVIDENCE** | Shakibul reports the bug and references YouTube as the expected behavior. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-20: Feed Management vs Post Editor Naming Confusion

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-20 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Implied: "Feed Management" section existed in navigation |
| **LATER_REQUIREMENT** | 6/2/26 2:27PM — Shakibul: "From Manage Listing I go to Feed Management, there I see Post Editor. Why is it called Feed Management?" (lines 1106, 1111–1112). "Post Editor should have a direct option" (line 1114). |
| **FINAL_KNOWN_POSITION** | Navigation should clearly separate "Create Post" (company updates) and "Create Listing" (products). "Post Editor" needs a direct navigation option. |
| **EVIDENCE** | Shakibul identifies naming confusion between feed management and post editor, and requests clearer navigation. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-21: Free User Product Upload Limit

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-21 |
| **CHANGE_TYPE** | CONTRADICTION (ambiguous) |
| **EARLIER_REQUIREMENT** | Referenced: Free users limited to 2 products per day |
| **LATER_REQUIREMENT** | 6/2/26 3:01PM — Shakibul: "Free users can add max 2 products per day, we had a rule. Here give whatever is correct, no problem" (lines 1127–1129) |
| **FINAL_KNOWN_POSITION** | Shakibul references the 2-product-per-day rule but says "give whatever is correct." No clear confirmation if the rule is still active. |
| **EVIDENCE** | Shakibul references the rule but then defers to Mira's implementation. |
| **CONFIDENCE** | LOW — Ambiguous final position. |

---

## CONFLICT-22: Contract Vault Page Missing

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-22 |
| **CHANGE_TYPE** | STATUS_CHANGE (implemented → missing) |
| **EARLIER_REQUIREMENT** | 3/4/26 — Contract Vault listed in Mira's page list (line 202: "Contract Vault/Legal PDF (Dynamic)") |
| **LATER_REQUIREMENT** | 6/2/26 8:47AM — Shakibul: "I didn't find contracts vault, is it removed?" (line 1083) |
| **FINAL_KNOWN_POSITION** | Contract Vault was planned and listed but appears to be missing from the deployed version. |
| **EVIDENCE** | Page was in the original page list but Shakibul reports it's absent from the live site. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-23: Mail System — Not Implemented

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-23 |
| **CHANGE_TYPE** | STATUS_CHANGE (planned → not implemented) |
| **EARLIER_REQUIREMENT** | 3/31/26 — Shakibul receives emails from termsfeed.com but asks about the platform's own email system (lines 898–901) |
| **LATER_REQUIREMENT** | 3/31/26 10:34AM — Mira: "I haven't added any mail system to the web yet" (line 902). Shakibul then provides Gmail API vs SMTP comparison (lines 918–971). 6/1/26 11:11PM — Shakibul reports support system emails not received (lines 1077–1079). |
| **FINAL_KNOWN_POSITION** | Email system not implemented. Shakibul provided comparison but left the decision to Mira ("Use whatever is best, decision is yours" — line 972). Support email notifications confirmed broken. |
| **EVIDENCE** | Mira explicitly states no mail system exists. Shakibul's support reports go unanswered. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-24: Design Color — Grey Changed to White

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-24 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Implied: Grey color used in some design elements |
| **LATER_REQUIREMENT** | 3/4/26 2:21PM — Arnob: "dont use grey colour change grey code to white" (line 648). Earlier: 2/18/26 5:57PM — Arnob: "blue and white not grey" (line 181) |
| **FINAL_KNOWN_POSITION** | Use blue and white theme. No grey colors. |
| **EVIDENCE** | Arnob twice emphasizes no grey, blue+white only. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-25: Subscription Pricing Page Structure (3 separate → 1 universal with tiers)

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-25 |
| **CHANGE_TYPE** | SUPERSESSION |
| **EARLIER_REQUIREMENT** | 3/4/26 4:30PM — Shakibul: "Three types of accounts need three different pricing plans" (line 658) |
| **LATER_REQUIREMENT** | 2/20/26 9:36PM — Shakibul: "No need for specific plans for each account type. Show ONE subscription interface for everyone with Free + Premium" (lines 254–260) |
| **FINAL_KNOWN_POSITION** | Single pricing page with 2 tiers (Free + Premium). Feature details may vary per account type but pricing is unified. |
| **EVIDENCE** | Earlier requirement for 3 separate pages was explicitly contradicted by the later universal design. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-26: Member Invite — Internal Only vs Email-Based

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-26 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Implied: Member invite only works for internal accounts |
| **LATER_REQUIREMENT** | 6/1/26 10:56PM — Shakibul: "Member invite should work with any email, not just internal. Two methods: (1) Invite by internal agent ID, (2) Invite by email to anyone" (lines 1031–1037) |
| **FINAL_KNOWN_POSITION** | Two invite methods: internal ID-based and external email-based. Email invite should work for any email address. |
| **EVIDENCE** | Shakibul tested email invite and it failed. Requests both methods be implemented. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-27: Data Download — Button Exists But No Data

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-27 |
| **CHANGE_TYPE** | STATUS_CHANGE (feature incomplete) |
| **EARLIER_REQUIREMENT** | Data download button was implemented in the UI |
| **LATER_REQUIREMENT** | 6/1/26 10:41PM — Shakibul: "Data download option doesn't work" (line 1016). 6/1/26 11:04PM — "Download shows 'no downloadable data' but I created an account with info" (lines 1060–1063) |
| **FINAL_KNOWN_POSITION** | Data download feature is broken — button exists but backend returns no data despite user data existing. |
| **EVIDENCE** | Shakibul reports the issue with screenshots. The feature is non-functional. |
| **CONFIDENCE** | HIGH |

---

## CONFLICT-28: Profile Features Visibility — Console View vs Full View

| Field | Value |
|---|---|
| **FINDING_ID** | CONFLICT-28 |
| **CHANGE_TYPE** | CORRECTION |
| **EARLIER_REQUIREMENT** | Member management features shown fully on initial page |
| **LATER_REQUIREMENT** | 6/2/26 2:24PM — Shakibul: "When going from console to member option, not all features show. Should match the initial page" (lines 1102–1104) |
| **FINAL_KNOWN_POSITION** | Member management features must be consistent between the initial view and console navigation. Same features, same layout. |
| **EVIDENCE** | Shakibul identifies the inconsistency between two access paths to the same feature. |
| **CONFIDENCE** | HIGH |

---

## Summary Statistics

| Category | Count |
|---|---|
| SUPERSESSION (old → new) | 9 |
| CORRECTION (bug/fix/reverse) | 9 |
| ABANDONMENT (dropped entirely) | 3 |
| CONTRADICTION (conflicting signals) | 3 |
| STATUS_CHANGE (planned → missing/broken) | 3 |
| Rejected proposals | 1 |
| **TOTAL** | **28** |

### Key Recurring Patterns

1. **Technology stack instability** (CONFLICT-01, -02, -03, -04): Backend framework changed 3 times, AI integration reversed, database proposed then rejected, hosting provider abandoned.
2. **Feature scope creep then retreat** (CONFLICT-05, -06, -09, -15, -16): AI chatbot described with rich features then simplified to FAQ bot; boost deferred then re-included; auto-rating abolished; industry selection cancelled.
3. **Shakibul self-correcting** (CONFLICT-14, -17): Shakibul acknowledges causing feature removal (Post Editor) and restructures requirements (coupon system).
4. **Design/UX feedback loops** (CONFLICT-12, -13, -24): Figma requirement abandoned; features shown during signup flagged as wrong; color scheme corrected.
5. **Implementation gaps** (CONFLICT-22, -23, -27): Contract Vault missing, email system not implemented, data download broken.
