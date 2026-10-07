import MarkdownReadme from "../feed/MarkdownReadme.jsx";
import LazyImage from "./LazyImage.jsx";

function wordCount(text) {
	if (!text) {
		return 0;
	}
	return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function PostPreview({ item }) {
	const words = wordCount(item.descriptionMarkdown);
	const isUserFeedPost = item.entityType === "user_feed_post";

	return (
		<div class="space-y-5">
			{/* Title */}
			<div>
				<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
					Title *
				</span>
				<h3 class="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
					{item.title || "Untitled"}
				</h3>
			</div>

			{/* Category */}
			{item.category ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Category
					</span>
					<div class="mt-1">
						<span class="inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
							{item.category}
						</span>
					</div>
				</div>
			) : null}

			{/* Caption */}
			{item.content ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Caption
					</span>
					<p class="mt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
						{item.content}
					</p>
				</div>
			) : null}

			{/* README / Longform + word count */}
			{item.descriptionMarkdown ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						README / Longform
					</span>
					<div class="mt-1 rounded-xl bg-white p-3 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:ring-white/10">
						<MarkdownReadme content={item.descriptionMarkdown} />
					</div>
					<p class="mt-1 text-xs text-slate-400 dark:text-slate-500">{words} / 600 words</p>
				</div>
			) : null}

			{/* Hashtags */}
			{Array.isArray(item.tags) && item.tags.length > 0 ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Hashtags
					</span>
					<div class="mt-1 flex flex-wrap gap-2">
						{item.tags.map((tag, i) => (
							<span
								key={`tag-${i}`}
								class="rounded-full bg-[var(--theme-blue-500-10)] px-3 py-1 text-[11px] font-semibold text-[var(--theme-blue-600)] dark:bg-[var(--theme-sky-400-10)] dark:text-[var(--theme-sky-400)]"
							>
								#{tag}
							</span>
						))}
					</div>
				</div>
			) : null}

			{/* Mentions */}
			{Array.isArray(item.mentions) && item.mentions.length > 0 ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Mentions
					</span>
					<div class="mt-1 flex flex-wrap gap-2">
						{item.mentions.map((mention, i) => (
							<span
								key={`mention-${i}`}
								class="rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300"
							>
								@{mention}
							</span>
						))}
					</div>
				</div>
			) : null}

			{/* Product Tags */}
			{Array.isArray(item.productTags) && item.productTags.length > 0 ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Product Tags
					</span>
					<div class="mt-1 flex flex-wrap gap-2">
						{item.productTags.map((tag, i) => (
							<span
								key={`product-tag-${i}`}
								class="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
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
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Location
					</span>
					<p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.locationTag}</p>
				</div>
			) : null}

			{/* Media */}
			{Array.isArray(item.media) && item.media.length > 0 ? (
				<div>
					<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
						Media ({item.media.length})
					</span>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{item.media.map((entry, i) => (
							<div
								key={`media-${i}`}
								class="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200/70 dark:ring-white/10"
							>
								{String(entry.type || "").startsWith("video") ? (
									<video
										class="h-40 w-full object-cover"
										src={entry.url}
										controls={true}
										preload="metadata"
									/>
								) : (
									<LazyImage
										class="h-40 w-full object-cover"
										src={entry.url}
										alt={entry.alt || "Gallery image"}
										width={600}
										height={400}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}
