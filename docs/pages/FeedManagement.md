# FeedManagement - Route `/feed/manage`

**Access:** Protected - Owner/Admin/Agent roles

## 1) Purpose

Admin/owner page for managing feed posts. Allows:
- Creating new feed posts with rich content
- Adding media (images/videos)
- Setting categories, hashtags, mentions, product tags
- Previewing posts before publishing
- Viewing own created posts
- Deleting posts

**Backend interactions:**
- GET `/api/feed/posts/mine` - Fetch user's posts
- POST `/api/feed/posts` - Create new post
- DELETE `/api/feed/posts/:id` - Delete post

## 2) Page Structure (Components + Sections)

### 2.1 Imported Components
- `react-markdown` - Markdown rendering for readme/preview

### 2.2 Structural Sections
- Theme toggle (dark/light mode)
- Post creation form with fields:
  - Title, Category, Caption
  - README (markdown description)
  - CTA (text + URL)
  - Hashtags, Mentions, Links
  - Product tags, Location
- Media upload section
- Live preview panel
- My Posts list with delete functionality

## 3) Styling (className blocks)

### 3.1 Tailwind utilities used
- Layout: `flex`, `grid`, `min-h-screen`, `w-full`, `max-w-*`
- Colors: `bg-slate-*`, `text-slate-*`, `bg-white`, `text-black`
- Spacing: `p-*`, `m-*`, `gap-*`
- Dark mode: `dark` class on document

### 3.2 Custom CSS
- Inline SVG icons (no external library)
- `animate-spin` for loader

## 4) API Map

| Frontend Call | Backend Route | Purpose |
|---------------|---------------|---------|
| GET /api/feed/posts/mine | `/api/feed/posts/mine` | List user's posts |
| POST /api/feed/posts | `/api/feed/posts` | Create new post |
| DELETE /api/feed/posts/:id | `/api/feed/posts/:id` | Delete post |

## 5) Component Inventory

- `ReactMarkdown` - Markdown preview rendering
- Custom SVG Icon components (ArrowLeft, Check, Upload, Image, Loader, Plus, Play, Refresh, Sparkles, Trash, X)

## 6) State Management

- `useState` for:
  - `theme` - Dark/light mode
  - `form` - Post form data
  - `mediaRows` - Uploaded media files
  - `posts` - User's posts list
  - `loadingPosts` - Loading state
  - `uploading` - Upload state
  - `saving` - Save state
  - `error` - Error messages
- `useRef` for file input
- `useMemo` for preview metadata

## 7) Key Functions

- `splitCommaList(value)` - Split comma-separated values
- `formatDate(value)` - Format date for display
- `cn(...classes)` - Class name joiner
- `updateField(key, value)` - Update form field
- `openPicker()` - Open file picker
- `handleFiles(files)` - Handle file selection
- `clearForm()` - Reset form state
- `createPost()` - Submit new post

## 8) Animations & Motion

- `animate-spin` class on loader icon
- No Framer Motion detected

## 9) Theme / Dark Mode

- Toggle between dark/light themes
- Stored in localStorage `feed-theme`
- Uses `prefers-color-scheme` media query fallback

## 10) Accessibility

- Semantic HTML forms
- File input for media
- Delete buttons with confirmation

## 11) Open Issues / TODOs

- No delete endpoint shown in code
- Error handling could be improved

## 12) Test Coverage

- Test file: `tests/unit/feedManagement.test.js` (if exists)

## 13) Route Guards & Redirects

- Requires JWT token
- Checks localStorage for token
- Shows error if token missing

## 14) External Dependencies

- `react-markdown` - Markdown rendering

## 15) Performance Notes

- Media preview using `URL.createObjectURL`
- Should revoke object URLs on cleanup
- ~1007 lines - consider code splitting

## 16) Error Handling

- Try/catch blocks in async functions
- Error state display
- User-friendly error messages

## 17) Analytics Events

- No explicit analytics tracking

## 18) URL Params / Query Params

- None detected

## 19) Real-time Updates

- No WebSocket/SSE
- Manual refresh on load

## 20) Form Validation

- Title validation before submit
- Token presence check
- No Zod/Yup schemas

## 21) Keyboard Shortcuts

- None detected

## 22) Feature Flags

- None detected

## 23) SEO / Meta

- No meta tags set

## 24) Caching Strategy

- No caching implemented

## 25) File Size / Bundle Impact

- ~1007 lines
- `react-markdown` adds to bundle
- Moderate bundle impact

---

*Generated from source: src/pages/FeedManagement.jsx*