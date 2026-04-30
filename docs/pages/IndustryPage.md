# IndustryPage - Route `/industry/:slug`

**Access:** Protected - All roles (buyer, buying_house, factory, owner, admin, agent)

## 1) Purpose

Industry/category landing page with:

- Pre-filtered search results for specific industry
- Industry statistics (top countries, buyer/factory counts)
- AI auto-reply widget for quick outreach
- Shows requests and products for the industry

**Backend interactions:**

- GET `/industry/:slug` - Fetch industry data and stats
- GET `/requirements/search?category=X` - Search buyer requests
- GET `/products/search?category=X` - Search products
- POST `/industry/:slug/auto-reply` - Generate AI auto-reply

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components

- `react-router-dom` - Link, useParams
- `lucide-react` - Sparkles, ArrowUpRight icons
- `../lib/auth` - apiRequest, getToken
- `../lib/events` - trackClientEvent

### 2.2 Structural Sections

- Header with category info and stats
- Statistics grid (top countries, buyer/factory counts)
- Two columns: Buyer Requests + Factory Products
- AI Auto-reply widget section
- Related links

## 3) Styling (className blocks)

### 3.1 Tailwind utilities used

- Layout: `flex`, `grid`, `min-h-screen`, `max-w-7xl`
- Colors: `bg-slate-50`, `text-slate-900`, `dark:bg-[#020617]`
- Spacing: `p-6`, `py-6`, `space-y-6`
- Dark mode: `dark:` prefixes, `transition-colors duration-500`

## 4) API Map

| Frontend Call                   | Backend Route                | Purpose               |
| ------------------------------- | ---------------------------- | --------------------- |
| GET /industry/:slug             | `/industry/:slug`            | Get industry data     |
| GET /requirements/search        | `/requirements/search`       | Search buyer requests |
| GET /products/search            | `/products/search`           | Search products       |
| POST /industry/:slug/auto-reply | `/industry/:slug/auto-reply` | AI auto-reply         |

## 5) Component Inventory

- `StatCard` - Statistics display card (inline component)
- Lucide icons: Sparkles, ArrowUpRight

## 6) State Management

- `useState` for:
  - `loading` - Loading state
  - `error` - Error message
  - `summary` - Industry summary data
  - `requests` - Buyer requests list
  - `products` - Products list
  - `aiReply` - Generated AI reply
  - `aiLoading` - AI loading state
  - `aiError` - AI error message
  - `copyStatus` - Copy to clipboard status
- `useMemo` for token
- `useEffect` for data loading

## 7) Key Functions

- `generateAutoReply()` - Call AI endpoint for auto-reply
- `copyReply()` - Copy AI reply to clipboard

## 8) Animations & Motion

- `transition-colors duration-500 ease-in-out` on main container
- No Framer Motion detected

## 9) Theme / Dark Mode

- Full dark mode support via `dark:` prefix
- Uses `bg-slate-50` / `dark:bg-[#020617]` pattern
- Smooth color transitions

## 10) Accessibility

- Semantic HTML structure
- Loading and error states for screen readers
- Copy functionality with status feedback

## 11) Open Issues / TODOs

- None detected

## 12) Test Coverage

- Test file: `tests/unit/industryPage.test.js` (if exists)

## 13) Route Guards & Redirects

- Route param `:slug` required
- Requires authentication token

## 14) External Dependencies

- `lucide-react` - Icons

## 15) Performance Notes

- Two parallel API calls for requests/products
- Consider pagination for large result sets

## 16) Error Handling

- Try/catch in useEffect
- Error state display
- Loading state shown during fetch

## 17) Analytics Events

- `trackClientEvent("industry_page_view")` - On page load
- `trackClientEvent("industry_auto_reply")` - On AI reply generation

## 18) URL Params / Query Params

- `slug` - Industry identifier from URL params
- Query params: `category` for search

## 19) Real-time Updates

- No WebSocket/SSE
- Manual refresh only

## 20) Form Validation

- None (view-only page with AI widget)

## 21) Keyboard Shortcuts

- None detected

## 22) Feature Flags

- None detected

## 23) SEO / Meta

- No explicit meta tags

## 24) Caching Strategy

- No caching implemented

## 25) File Size / Bundle Impact

- ~303 lines - lightweight
- Minimal bundle impact

---

_Generated from source: src/pages/IndustryPage.jsx_
