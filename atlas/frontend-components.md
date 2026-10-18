# frontend-components

- **Parent**: (none — under `src/`)
- **Purpose**: Reusable presentational + interactive UI used by pages. 66 files.
- **Key Files**: `src/components/NavBar.jsx`, `src/components/Footer.jsx`, `src/components/FloatingAssistant.jsx`, `src/components/LenisProvider.jsx`, `src/components/OfflineBanner.jsx`, `src/components/OfflineStorageSection.jsx`, `src/components/ThemeSwitcher.jsx`, `src/components/feed/FeedItemCard.jsx`, `src/components/ui/*`
- **Dependencies**: frontend-lib, frontend-store, frontend-offline, frontend-theme
- **Dependents**: frontend-app, frontend-pages
- **Exposes**: Nav, footer, AI assistant drawer, offline banner + storage manager, theme switcher, feed cards/modals, chat cards, ~30 ui primitives (LazyImage, MagneticButton, NeonAtom, CyberpunkCursor, VideoEmbed, StructuredData, …).

## Internal Structure
- **ui/**: ~30 generic primitives — BackButton, BotLogo, CodeBlock, CyberpunkCursor, DocumentViewer, IconNavLink, LazyImage, LinkPreviewCard, MagneticButton, MagneticNavLink, NavDropdown, NeonAtom, PostPreview, ProfileImageUpload, SpotlightCard, StructuredData, UploadProgressBar, VideoEmbed, WatermarkOverlay, WordCount.
- **feed/**: FeedItemCard, PostDetailModal, ReportModal, MarkdownReadme.
- **chat/**: AttachmentPreviewModal, FileAttachmentCard, MarkdownMessage.
- **admin/**: PaymentProofReviewModal, RejectionReasonModal.
- **analytics/**: ConversionFunnel, CoreMetricsCards.
- **profile/**: CrmSummaryPanel, VerificationPanel.
- **leads/**: LeadManager. **products/**: ProductQuickViewModal.
- **Motion/scroll**: ScrollReveal, ParallaxBackground, StaggerContainer, ScaleIn, SlideIn, AnimatedAccordion, AnimatedModal, StickySection, TextColorReveal, CardStack, CountUp, ConfirmDialog, ErrorBoundary, HoverCard, FlipCard, Magnetism, JourneyTimeline, ToastContainer, ScrollToTop, ScrollProgressBar, ScrollVelocityText, MasonryGrid, HorizontalScrollGallery, WordleInput, AccessDeniedState.
- **Offline/theme surfaces**: `OfflineBanner.jsx` (fixed bottom pill, `role="status" aria-live="polite"`, per-connectivity-state copy, SW-update card that posts `SKIP_WAITING`, retry button, pending-draft count), `OfflineStorageSection.jsx`, `ThemeSwitcher.jsx`.
- Every scroll panel carries `data-lenis-prevent` (Lenis intercepts wheel globally).

## Gotchas
- `CyberpunkCursor.jsx` is **keyboard-activated**, default `enabled=false`. Type `activate cursor` to enable, `disable cursor` to disable (sliding keystroke buffer; ignores auto-repeat, modifier combos, non-character keys). Nothing runs (no canvas, no `body.style.cursor = "none"`) until activated.
- `ThemeSwitcher.jsx`'s theme list scrolls independently of the page (`max-h-[60vh] overflow-y-auto` + `data-lenis-prevent` + wheel/touch `stopPropagation`).
- `AccessDeniedState.jsx` and `WordleInput.jsx` are not yet wired to routes.