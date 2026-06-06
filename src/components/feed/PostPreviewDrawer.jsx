import { X, ArrowUpRight, ExternalLink } from "lucide-react";
import MarkdownReadme from "./MarkdownReadme";
import LinkPreviewCard from "../ui/LinkPreviewCard";

function wordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function PostPreviewDrawer({ open, onClose, item }) {
  if (!open || !item) return null;

  const words = wordCount(item.descriptionMarkdown);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto animate-slide-in">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Post Preview
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Title */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Title *
            </span>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {item.title || "Untitled"}
            </h3>
          </div>

          {/* Category */}
          {item.category ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Category
              </span>
              <span className="ml-2 inline-flex rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                {item.category}
              </span>
            </div>
          ) : null}

          {/* Caption */}
          {item.content ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Caption
              </span>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.content}
              </p>
            </div>
          ) : null}

          {/* README / Longform */}
          {item.descriptionMarkdown ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                README / Longform
              </span>
              <div className="mt-1 rounded-xl bg-white p-3 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
                <MarkdownReadme content={item.descriptionMarkdown} />
              </div>
              {/* Word count */}
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {words} / 600 words
              </p>
            </div>
          ) : null}

          {/* CTA */}
          {item.ctaText && item.ctaUrl ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                CTA
              </span>
              <div className="mt-1 space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {item.ctaText}
                </p>
                <a
                  href={item.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gtBlue hover:underline break-all"
                >
                  {item.ctaUrl}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : null}

          {/* Hashtags */}
          {Array.isArray(item.tags) && item.tags.length ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Hashtags
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span
                    key={`tag-${i}`}
                    className="rounded-full bg-[#3b82f6]/10 px-3 py-1 text-[11px] font-semibold text-[#2563eb] dark:bg-[#38bdf8]/10 dark:text-[#38bdf8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Mentions */}
          {Array.isArray(item.mentions) && item.mentions.length ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Mentions
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {item.mentions.map((mention, i) => (
                  <span
                    key={`mention-${i}`}
                    className="rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300"
                  >
                    @{mention}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Links (external URL previews) */}
          {Array.isArray(item.links) && item.links.length ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Links
              </span>
              <div className="mt-2 grid gap-3">
                {item.links.slice(0, 4).map((url, i) => (
                  <LinkPreviewCard
                    key={`preview-link-${i}`}
                    url={url}
                    preview={(item.link_previews && item.link_previews[i]) || null}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Product Tags */}
          {Array.isArray(item.productTags) && item.productTags.length ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Product Tags
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {item.productTags.map((tag, i) => (
                  <span
                    key={`product-tag-${i}`}
                    className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Location Tag */}
          {item.locationTag ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Location
              </span>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {item.locationTag}
              </p>
            </div>
          ) : null}

          {/* Media */}
          {Array.isArray(item.media) && item.media.length ? (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Media ({item.media.length})
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {item.media.map((entry, i) => (
                  <div
                    key={`media-${i}`}
                    className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200/70 dark:ring-white/10"
                  >
                    {entry.type === "video" ? (
                      <video
                        className="h-40 w-full object-cover"
                        src={entry.url}
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        className="h-40 w-full object-cover"
                        src={entry.url}
                        alt={entry.alt || ""}
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
