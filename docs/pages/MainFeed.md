# MainFeed - Complete Page Specification (Manual)

## Page Title & Description
- Page title: `MainFeed`
- Route: `/feed` (protected; roles in `AUTH_ROLES`)
- Purpose: Display combined buyer requests and company products, with social actions, moderation report flow, and conversation claim entry point.

## Layout & Structure
- Overall:
  - 12-column responsive grid in centered container (`max-w-7xl`).
- Desktop composition:
1. Left sidebar (`col-span-3`, hidden below `lg`):
  - User summary card.
  - Unique Algorithm toggle card.
  - Quick filter buttons.
2. Center feed (`col-span-12 lg:col-span-6`):
  - Feedback banner.
  - Loading/error/empty states.
  - Feed cards list.
3. Right sidebar (`col-span-3`, hidden below `xl`):
  - Suggested connections.
  - Trending categories.
  - Recently active buyers.

Feed card internal layout:
- Header row: avatar placeholder, author, verified marker, account type, relative timestamp.
- Body: content text, optional video placeholder, tags.
- Footer action row: comment/share/save/report and contextual CTA (`Express Interest` or `Message`).
- Optional deadline strip (`Deadline: ...`) at bottom.

Approximate placement:
- Left rail: x 0-25%.
- Main feed: x 25-75%.
- Right rail: x 75-100%.

## Theme & Styling
- Page background: `bg-gray-50`.
- Card style: white panels with subtle borders and hover elevation.
- Accent colors:
  - Primary action: blue (`bg-blue-600`, `hover:bg-blue-700`).
  - Positive marker: green dot in active buyers list.
  - Error message: red panel.
  - Informational/success banner: blue-toned panel.
  - Deadline strip: yellow warning-like strip.
- Typography:
  - Body-first with clear metadata hierarchy (`text-xs` for secondary details).
- Spacing:
  - Global `p-4`, card `p-4`, section `space-y-*`.

## Content Details
Static/explicit text in UI:
- Left panel:
  - `Connections`
  - `Feed Items`
  - `Unique Algorithm`
  - `Diversify your feed`
  - `Quick Filters`
  - `All Posts`
  - `Buyer Requests`
  - `Company Products`
- Center status text:
  - `Loading feed...`
  - `No feed items found for this filter.`
- Card actions:
  - `Comment`
  - `Share`
  - `Save`
  - `Report` (or `Report (<Ns>)` during cooldown)
  - `Express Interest` / `Claiming...` for buyer requests
  - `Message` for product posts
- Right panel:
  - `Suggested Connections`
  - `No suggestions yet`
  - `Add`
  - `Trending Categories`
  - `No trend data yet`
  - `Recently Active Buyers`
  - `No buyer activity yet`
- Dynamic helper text:
  - `Video available` for video placeholder.
  - `Deadline: <value>` if deadline exists.

## Interactions & Functionality

### Data loading
- On mount:
  - loads user from `/auth/me`.
  - loads feed from `/feed?unique=<bool>&type=<all|requests|products>`.
- Converts response arrays via:
  - `toArray`
  - `normalizeFeedItem`

### Filters
- `All Posts` -> no entity filter.
- `Buyer Requests` -> `entityType === buyer_request`.
- `Company Products` -> `entityType === company_product`.

### Unique toggle
- Boolean state `uniqueToggle`.
- Triggers feed reload with query parameter `unique=true/false`.

### Social actions
- Endpoint: `POST /social/actions`
- Body:
```json
{
  "entityId": "<post.id>",
  "entityType": "<buyer_request|company_product>",
  "action": "<comment|share|save|report|message|express_interest>",
  "reason": "<optional for report>"
}
```
- UI behavior:
  - Prevents duplicate action submission using `submittingActions` set.
  - Shows success/error feedback message banner.

### Report flow
- On report click:
  - opens `window.prompt` for optional reason.
  - if empty/short, uses fallback reason text.
  - starts 15-second cooldown per post on successful report.

### Express interest flow
- Endpoint: `POST /conversations/:postId/claim`.
- Behavior:
  - success `granted` -> shows "access already granted" message.
  - success normal -> shows "lock claimed" message.
  - `locked` error -> shows lock conflict guidance.

### Derived sidebar data
- Suggested connections:
  - unique author names not matching current user.
- Trending tags:
  - frequency count over post tags.
- Active buyers:
  - unique buyer-request author names.

## Images & Media
- No real image URLs are rendered in this component.
- Media rendering:
  - video availability represented by placeholder block and text `Video available`.
- Icon-like glyphs and symbols are text-based/emojis.

## Extra Notes / Metadata
- SEO:
  - no page-level metadata in component.
- Accessibility:
  - Buttons use disabled state for async operations.
  - Consider replacing prompt-based report UI with accessible modal for better keyboard/screen-reader support.
- Responsive:
  - Sidebars collapse on smaller screens (`lg`/`xl` breakpoints).
- State management:
  - Entire page is local React state; no external store.
