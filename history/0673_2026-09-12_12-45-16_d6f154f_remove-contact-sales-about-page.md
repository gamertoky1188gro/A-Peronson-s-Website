# Commit 0673 — d6f154f

| Field | Value |
|-------|-------|
| **Commit Number** | 0673 |
| **Commit Hash** | d6f154fc91880762ff2e33f26f6660ecf6beb469 |
| **Parent Hash** | 8ba7f32bc074dac41ca92f29cbd3885e378c9e6f |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 12:45:16 |
| **Branch** | main |
| **Files Changed** | 49 |
| **Additions** | 51 |
| **Deletions** | 66 |
| **Net Change** | +51/-66 |

## Remove Contact Sales from About Page Per Buyer Feedback

This commit removes both "Contact Sales" buttons from the About page, removes the `ExternalLink` icon import, and rewrites the CTA section heading from "Contact & legal" to "Trust & verification" with new description text. The bulk of file changes are dist asset renames from a rebuild.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| dist/assets/About-Brmm3-V3.js | Added | 1 | 0 | +1 |
| dist/assets/About-C-H2-JEC.js | Removed | 0 | 1 | -1 |
| dist/assets/AccessDenied-CwGCKaX4.js | Renamed | 1 | 1 | 0 |
| dist/assets/AdminGovernance-WBHJ8Lzo.js | Renamed | 1 | 1 | 0 |
| dist/assets/AdminPanel-CT6TFIg4.js | Renamed | 1 | 1 | 0 |
| dist/assets/AgentDashboard-Cal0Cv8N.js | Renamed | 1 | 1 | 0 |
| dist/assets/BuyerProfile-BP2NI6WW.js | Renamed | 1 | 1 | 0 |
| dist/assets/BuyerRequestManagement-ym5Nk3J3.js | Renamed | 1 | 1 | 0 |
| dist/assets/BuyingHouseProfile-eRmH8LGV.js | Renamed | 1 | 1 | 0 |
| dist/assets/CallInterface-CJbH5izn.js | Renamed | 1 | 1 | 0 |
| dist/assets/ChatInterface-a60OvsLC.js | Renamed | 1 | 1 | 0 |
| dist/assets/FactoryProfile-GtOtxEtA.js | Renamed | 1 | 1 | 0 |
| dist/assets/FeedManagement-Dj-GBPJt.js | Renamed | 1 | 1 | 0 |
| dist/assets/FeedbackPage-y_v9CUDa.js | Renamed | 1 | 1 | 0 |
| dist/assets/HelpCenter-1R6bPj5p.js | Renamed | 1 | 1 | 0 |
| dist/assets/IndustryPage-BFw-j_ZV.js | Renamed | 1 | 1 | 0 |
| dist/assets/Insights-C_DXr2vh.js | Renamed | 1 | 1 | 0 |
| dist/assets/JoinRequestPage-B9mcJF5O.js | Renamed | 1 | 1 | 0 |
| dist/assets/JourneyTimeline-B6y18-VN.js | Renamed | 1 | 1 | 0 |
| dist/assets/Login-w0G8Jj7-.js | Renamed | 1 | 1 | 0 |
| dist/assets/MainFeed-BbnbAkrr.js | Renamed | 1 | 1 | 0 |
| dist/assets/MemberManagement-DfMfTIiw.js | Renamed | 1 | 1 | 0 |
| dist/assets/NotificationsCenter-7mX3X6_z.js | Renamed | 1 | 1 | 0 |
| dist/assets/OnboardingPage-BZ6HwUFD.js | Renamed | 1 | 1 | 0 |
| dist/assets/OrgSettings-CG0MU4T3.js | Renamed | 1 | 1 | 0 |
| dist/assets/OwnerDashboard-EyI3gS-q.js | Renamed | 1 | 1 | 0 |
| dist/assets/PartnerNetwork-pRODldKs.js | Renamed | 1 | 1 | 0 |
| dist/assets/Pricing-B5h-OncC.js | Renamed | 1 | 1 | 0 |
| dist/assets/ProductManagement-adWyc1FO.js | Renamed | 1 | 1 | 0 |
| dist/assets/ProfileImageUpload-D4fqzQ2r.js | Renamed | 1 | 1 | 0 |
| dist/assets/ProfilePage-gqFzVmtC.js | Renamed | 1 | 1 | 0 |
| dist/assets/RatingFeedback-BzYTA76T.js | Renamed | 1 | 1 | 0 |
| dist/assets/ScaleIn-b8TKdKnR.js | Renamed | 1 | 1 | 0 |
| dist/assets/SearchResults-B-GGgVyB.js | Renamed | 1 | 1 | 0 |
| dist/assets/Signup-D8-AE6Db.js | Renamed | 1 | 1 | 0 |
| dist/assets/SignupUltra-BoGlG-kN.js | Renamed | 1 | 1 | 0 |
| dist/assets/SupportReports-Cstb3k8X.js | Renamed | 1 | 1 | 0 |
| dist/assets/TaskTracker-8HQMnso9.js | Renamed | 1 | 1 | 0 |
| dist/assets/TexHub-BVmGC7jO.js | Renamed | 1 | 1 | 0 |
| dist/assets/UploadProgressBar-D76S-m7O.js | Renamed | 1 | 1 | 0 |
| dist/assets/VerificationPage-CM_49q_x.js | Renamed | 1 | 1 | 0 |
| dist/assets/VerificationPanel-Ydtavvbt.js | Renamed | 1 | 1 | 0 |
| dist/assets/index-DyuHP4-6.js | Renamed | 4 | 2 | +2 |
| dist/assets/index-upHWGTff.css | Added | 1 | 0 | +1 |
| dist/assets/index-xtlljGZb.css | Removed | 0 | 1 | -1 |
| dist/assets/useAnalyticsDashboard-Cn5bXBeg.js | Renamed | 1 | 1 | 0 |
| dist/assets/useSecureUser-GBz8VD5S.js | Renamed | 1 | 1 | 0 |
| dist/index.html | Modified | 4 | 2 | +2 |
| src/pages/About.jsx | Modified | 21 | 21 | 0 |

## Detailed Diff Analysis

### src/pages/About.jsx — Source Changes

**1. Remove ExternalLink import:**
```diff
 import {
     Check,
     ChevronRight,
     CircleAlert,
-    ExternalLink,
     FileText,
```

**2. Remove hero "Contact Sales" button:**
```diff
 <MagneticButton
-    to="/contracts"
+    ...removed entirely...
 >
-    Contact sales
-    <ExternalLink className="h-4 w-4" />
 </MagneticButton>
```

**3. Remove CTA "Contact Sales" button:**
```diff
 <MagneticButton
-    to="/contracts"
+    ...removed entirely...
 >
-    Contact sales
-    <ArrowUpRight className="h-4 w-4" />
 </MagneticButton>
```

**4. Rewrite CTA section heading:**
```diff
 <SectionHeading
-    eyebrow="Contact & legal"
-    title="Official communication channels for partnership and support"
-    description="For partnership inquiries, support, or compliance-related questions, please contact us through the official communication channels listed on the platform."
+    eyebrow="Trust & verification"
+    title="Our verification standards are publicly available"
+    description="Learn how we verify factories, buying houses, and buyers on the platform. Transparency is core to how GarTexHub works."
 />
```

### dist/index.html — CSS hash changes

The dist build output changes CSS hash names due to the removed button styles.

## Why This Change Was Needed

This commit is driven by buyer feedback. Buyers reported that the "Contact Sales" buttons on the About page were confusing or unwanted. The buttons were added in commit 0670 to route sales inquiries to `/contracts`, but this was apparently not the right UX decision based on user feedback.

The CTA section is repurposed from "Contact & legal" to "Trust & verification" — shifting the focus from sales contact to platform transparency, which is more aligned with buyer expectations on an About page.

## Was It Useful

Yes — responding to buyer feedback is essential. Removing the sales buttons simplifies the About page and shifts its focus to trust/transparency, which is more appropriate for an About page. The `ExternalLink` icon removal cleans up unused imports.

## Impact Analysis

- **User-facing:** About page no longer has "Contact Sales" buttons; CTA section now highlights verification standards
- **Navigation:** Users who clicked "Contact Sales" on About page now have one fewer path to `/contracts`
- **Code cleanup:** Removed unused `ExternalLink` import
- **Risk:** Very low — UI text and button removal, no logic changes

## Relationship to Surrounding Commits

- **Predecessor (0672):** Performance optimization (health endpoint, prefetch)
- **Successor (0674):** Hides search bar when logged out
- This commit reverts part of the About page changes from 0670 (which added the Contact Sales buttons)

## Confidence Notes

This is a clean revert of the Contact Sales addition from 0670, combined with a CTA section rewrite. The dist file renames are from Vite's content-hash bundling — 47 of the 49 changed files are just hash renames.

## Optional Technical Details

- The `MagneticButton` component is a custom button with hover animation effects
- The CTA section uses `SpotlightCard` with gradient background
- The heading uses `SectionHeading` component with eyebrow, title, and description props
- The dist build produces new content hashes because the About.jsx bundle changed
