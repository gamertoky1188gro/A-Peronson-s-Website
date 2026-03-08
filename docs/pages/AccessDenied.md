# AccessDenied - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Access denied`
- Route: `/access-denied`
- Purpose: Inform authenticated/unauthenticated users that they lack permission for the requested route and provide navigation recovery actions.

## Layout & Structure
- Full-height page wrapper with centered content card.
- Card content:
  - title
  - explanatory message referencing attempted path (`location.state.from` fallback to `this page`)
  - two action links.

Approximate placement:
- Card positioned near upper-middle (`mt-16`) within centered max-width container.

## Theme & Styling
- Light neutral auth-like style.
- Primary action:
  - indigo filled button.
- Secondary action:
  - bordered neutral button.
- Typography:
  - bold heading + muted explanatory text.

## Content Details
Exact text:
- Heading: `Access denied`
- Body template:
  - `You do not have permission to access <from>.`
- Action links:
  - `Login with another account`
  - `Go to Feed`

## Interactions & Functionality
- Reads location state:
  - `location.state?.from` to display blocked route.
- Navigation actions:
  - link to `/login`
  - link to `/feed`
- No API calls in this component.

## Images & Media
- No media assets.

## Extra Notes / Metadata
- SEO:
  - no explicit metadata.
- Accessibility:
  - clear heading and action links for recovery.
- UX:
  - message includes concrete route when available, improving clarity for role-based redirect scenarios.
