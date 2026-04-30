# SupportReports - Route `/support`

**Access:** Protected - All roles

## 1) Purpose

Support ticket system:

- Submit bug reports, feature requests, account issues
- Category and priority selection
- File attachment support
- View existing tickets and messages
- Reply to ticket threads

**Backend interactions:**

- GET `/api/support/tickets` - List user's tickets
- POST `/api/support/tickets` - Create new ticket
- GET `/api/support/tickets/:id/messages` - Get ticket messages
- POST `/api/documents` - Upload attachments

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components

- `../lib/auth` - apiRequest, API_BASE, getCurrentUser, getToken, hasEntitlement

### 2.2 Structural Sections

- Account manager info (if entitled)
- New ticket form:
  - Subject, Category dropdown
  - Description textarea
  - Page URL (optional)
  - Priority (for premium users)
  - Contact email
  - File attachment
- Existing tickets list with message threads
- Ticket reply form

## 3) Styling (className blocks)

### 3.1 Tailwind utilities used

- Layout: `flex`, `grid`, `min-h-screen`, `max-w-3xl`
- Colors: `bg-slate-50`, `text-slate-*`, `dark:bg-[#020617]`
- Spacing: `p-6`, `py-6`, `gap-4`, `space-y-4`
- Forms: `rounded-lg`, `border`, `focus:ring`

## 4) API Map

| Frontend Call                         | Backend Route                   | Purpose           |
| ------------------------------------- | ------------------------------- | ----------------- |
| GET /api/support/tickets              | `/support/tickets`              | List tickets      |
| POST /api/support/tickets             | `/support/tickets`              | Create ticket     |
| GET /api/support/tickets/:id/messages | `/support/tickets/:id/messages` | Get messages      |
| POST /api/documents                   | `/documents`                    | Upload attachment |

## 5) Component Inventory

- Pure React component (no child components)

## 6) State Management

- `useState` for:
  - `subject`, `category`, `description`, `pageUrl`
  - `priority`, `contactEmail`, `attachment`
  - `loading`, `feedback`, `reportId`
  - `tickets`, `ticketsLoading`
  - `messagesByTicket`, `messageDrafts`
- `useCallback` for loadTickets
- `useEffect` for initial load

## 7) Key Functions

- `loadTickets()` - Fetch tickets list
- `loadMessages(ticketId)` - Fetch ticket messages
- `submitReport(e)` - Submit new support ticket

## 8) Animations & Motion

- No Framer Motion detected

## 9) Theme / Dark Mode

- Full dark mode support via `dark:` prefixes

## 10) Accessibility

- Semantic HTML forms
- Form labels and placeholders

## 11) Open Issues / TODOs

- None detected

## 12) Test Coverage

- Test file: `tests/unit/supportReports.test.js` (if exists)

## 13) Route Guards & Redirects

- Requires token authentication
- Entitlement checks: `dedicated_support`, `dedicated_account_manager`

## 14) External Dependencies

- None (pure React + Tailwind)

## 15) Performance Notes

- Lazy loading of ticket messages
- ~419 lines

## 16) Error Handling

- Try/catch in async functions
- Error messages displayed to user

## 17) Analytics Events

- No explicit analytics tracking

## 18) URL Params / Query Params

- None

## 19) Real-time Updates

- None (polling not implemented)

## 20) Form Validation

- Subject required
- Category required
- Description required

## 21) Keyboard Shortcuts

- None

## 22) Feature Flags

- Entitlement-based features: `dedicated_support`, `dedicated_account_manager`

## 23) SEO / Meta

- No meta tags set

## 24) Caching Strategy

- No caching

## 25) File Size / Bundle Impact

- ~419 lines
- Moderate bundle impact

---

_Generated from source: src/pages/SupportReports.jsx_
