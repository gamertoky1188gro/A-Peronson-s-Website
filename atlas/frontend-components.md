# frontend-components

- **Purpose**: Reusable presentational + interactive UI used by pages.
- **Key Files**: `src/components/NavBar.jsx`, `src/components/Footer.jsx`, `src/components/FloatingAssistant.jsx`, `src/components/LenisProvider.jsx`, `src/components/feed/FeedItemCard.jsx`, `src/components/ui/*`
- **Dependencies**: frontend-lib, frontend-store
- **Dependents**: frontend-app, frontend-pages
- **Exposes**: Nav, footer, AI assistant drawer, feed cards/modals, chat cards, 20+ ui primitives (LazyImage, MagneticButton, NeonAtom, CyberpunkCursor, VideoEmbed, StructuredData…).

## Internal Structure
- **ui/**: 20 generic primitives (buttons, images, cursor, SEO structured data, upload progress).
- **feed/**: FeedItemCard, PostDetailModal, ReportModal, MarkdownReadme.
- **chat/**: AttachmentPreviewModal, FileAttachmentCard, MarkdownMessage.
- **admin/**: PaymentProofReviewModal, RejectionReasonModal.
- **Motion/scroll**: ScrollReveal, ParallaxBackground, StaggerContainer, LenisProvider; all scroll panels carry `data-lenis-prevent`.
