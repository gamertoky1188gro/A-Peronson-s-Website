# RatingFeedback - Route `/ratings/feedback`

**Access:** Protected - All roles

## 1) Purpose

Feedback/rating submission page:

- Display pending feedback requests
- Submit ratings (1-5 stars) with optional comments
- View user profiles via lookup
- Track interaction types

**Backend interactions:**

- GET `/api/ratings/feedback-requests` - Fetch pending feedback requests
- POST `/api/users/lookup` - Lookup user profiles by IDs
- POST `/api/ratings/profiles/:profile_key` - Submit rating

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components

- `react-router-dom` - useSearchParams

### 2.2 Structural Sections

- Header with description
- Feedback message banner
- Feedback requests list with:
  - User profile lookup
  - Star rating selector
  - Comment input
  - Submit button

## 3) Styling (className blocks)

### 3.1 Tailwind utilities used

- Layout: `flex`, `min-h-screen`, `max-w-5xl`
- Colors: `bg-slate-50`, `bg-amber-400`, `text-slate-*`, `dark:bg-[#020617]`
- Spacing: `p-6`, `py-6`, `space-y-4`, `gap-1`
- Transitions: `transition-colors duration-500 ease-in-out`

## 4) API Map

| Frontend Call                           | Backend Route                    | Purpose              |
| --------------------------------------- | -------------------------------- | -------------------- |
| GET /api/ratings/feedback-requests      | `/ratings/feedback-requests`     | Get pending requests |
| POST /api/users/lookup                  | `/users/lookup`                  | Lookup user profiles |
| POST /api/ratings/profiles/:profile_key | `/ratings/profiles/:profile_key` | Submit rating        |

## 5) Component Inventory

- `Stars` - Inline star rating component

## 6) State Management

- `useState` for:
  - `loading` - Loading state
  - `error` - Error message
  - `items` - Feedback requests list
  - `lookup` - User profile lookup map
  - `drafts` - Rating drafts by ID
  - `feedback` - Feedback message
- `useEffect` for data loading

## 7) Key Functions

- `updateDraft(id, patch)` - Update rating draft
- `submitRating(row)` - Submit rating to backend

## 8) Animations & Motion

- No Framer Motion detected

## 9) Theme / Dark Mode

- Full dark mode support via `dark:` prefixes

## 10) Accessibility

- `aria-label` on star buttons
- Keyboard accessible buttons

## 11) Open Issues / TODOs

- None detected

## 12) Test Coverage

- Test file: `tests/unit/ratingFeedback.test.js` (if exists)

## 13) Route Guards & Redirects

- Requires token authentication

## 14) External Dependencies

- None (pure React + Tailwind)

## 15) Performance Notes

- Parallel API calls for requests + lookup
- ~267 lines

## 16) Error Handling

- Try/catch in useEffect
- Error and success messages displayed

## 17) Analytics Events

- No explicit analytics tracking

## 18) URL Params / Query Params

- `profile_key` - Optional focus parameter from search params

## 19) Real-time Updates

- None

## 20) Form Validation

- Score required (1-5)
- Comment optional

## 21) Keyboard Shortcuts

- None

## 22) Feature Flags

- None

## 23) SEO / Meta

- No meta tags set

## 24) Caching Strategy

- No caching

## 25) File Size / Bundle Impact

- ~267 lines - lightweight
- Minimal bundle impact

---

_Generated from source: src/pages/RatingFeedback.jsx_
