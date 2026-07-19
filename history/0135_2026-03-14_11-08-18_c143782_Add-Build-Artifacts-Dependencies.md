# Commit 0135: Add Build Artifacts and Dependencies

## Commit Metadata

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| **Hash**    | `c14378293dc0adfd5b745f89d44f5865a5b9244f` |
| **Parent**  | `0cea0dd5cf76cee1b7508c6ed4aa921c6fb9942a` |
| **Author**  | gamertoky1188gro                           |
| **Date**    | 2026-03-14 11:08:18 +0600                  |
| **Message** | g                                          |

## High-Level Summary

Massive commit with 60 files changed, 68,124 insertions. Adds PDF.js worker, Prism.js syntax highlighting, xlsx/rtf file parsing, chat attachment components (AttachmentPreviewModal, FileAttachmentCard, MarkdownMessage), nginx config, call session improvements, and significant ChatInterface/CallInterface updates. Also adds `server/utils/pendingInvites.js`.

## File-by-File Breakdown

| File                                             | Status           | Key Changes                                                     |
| ------------------------------------------------ | ---------------- | --------------------------------------------------------------- |
| `dist/assets/*`                                  | New/Modified     | PDF worker (63k lines), Prism language files, xlsx, rtf bundles |
| `docs/nginx/gartexhub.conf`                      | New (+75)        | Nginx reverse proxy config                                      |
| `package.json`                                   | Modified (+11)   | New dependencies added                                          |
| `package-lock.json`                              | Modified (+2098) | Dependency lock update                                          |
| `server/controllers/callSessionController.js`    | Modified (+63)   | Extended call session endpoints                                 |
| `server/routes/callSessionRoutes.js`             | Modified (+2)    | Route updates                                                   |
| `server/server.js`                               | Modified (+73)   | Server config updates                                           |
| `server/services/callSessionService.js`          | Modified (+19)   | Call session logic                                              |
| `server/utils/pendingInvites.js`                 | New (+28)        | Pending invite management                                       |
| `src/components/FloatingAssistant.jsx`           | Modified (+8)    | Assistant updates                                               |
| `src/components/chat/AttachmentPreviewModal.jsx` | New (+897)       | Full-screen attachment preview with zoom/pan                    |
| `src/components/chat/FileAttachmentCard.jsx`     | New (+332)       | File attachment UI card                                         |
| `src/components/chat/MarkdownMessage.jsx`        | New (+75)        | Markdown-rendered messages                                      |
| `src/lib/auth.js`                                | Modified (+2)    | Auth tweaks                                                     |
| `src/pages/BuyerProfile.jsx`                     | Modified (+2)    | Minor updates                                                   |
| `src/pages/BuyingHouseProfile.jsx`               | Modified (+2)    | Minor updates                                                   |
| `src/pages/CallInterface.jsx`                    | Modified (+193)  | Call UI refinements                                             |
| `src/pages/ChatInterface.jsx`                    | Modified (+502)  | Chat UI major update                                            |
| `src/pages/FactoryProfile.jsx`                   | Modified (+2)    | Minor updates                                                   |
| `src/pages/MainFeed.jsx`                         | Modified (+2)    | Minor updates                                                   |
| `src/pages/MvpDashboard.jsx`                     | Modified (+2)    | Minor updates                                                   |
| `src/pages/SearchResults.jsx`                    | Modified (+2)    | Minor updates                                                   |
| `vite.config.js`                                 | Modified (+17)   | Vite config for PDF/Prism support                               |

## Detailed Diff Analysis

### Major Feature: File Viewing

- **PDF.js**: Added pdf.worker for PDF rendering in the browser
- **Prism.js**: Added syntax highlighting for 20+ languages
- **xlsx/rtf**: File parsing for Excel and RTF documents
- **AttachmentPreviewModal.jsx**: Full 897-line modal component for viewing file attachments
- **FileAttachmentCard.jsx**: 332-line card component for displaying attachment metadata
- **MarkdownMessage.jsx**: 75-line component for rendering markdown in chat

### Infrastructure

- **nginx config** (`docs/nginx/gartexhub.conf`): Production-ready reverse proxy setup
- **Dependencies**: New packages in package.json for file viewing capabilities

### ChatInterface.jsx

502-line update — integration of new attachment components, markdown rendering, pending invites handling.

## Why This Change

To add document viewing capabilities (PDF, syntax-highlighted code, spreadsheets) directly in the chat interface.

## Was It Useful

Yes. In-app file viewing eliminates the need to download files to view them.

## Impact Analysis

- **High risk**: Large commit with many new dependencies and components.
- **Repo size**: PDF.js worker alone adds 63k lines.
- **Build complexity**: Vite config updated for code splitting.

## Relationship to Surrounding Commits

Parent of 0136. Significant development milestone with file viewing features.

## Confidence Notes

Medium. The scale makes detailed analysis difficult. The feature additions are clear from file names and component sizes.
