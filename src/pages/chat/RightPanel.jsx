import {
	ChevronDown,
	ChevronUp,
	Flag,
	FolderOpen,
	Home,
	Info,
	Lock,
	Plus,
	Search,
	VolumeX,
} from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { getInitials, isVideoMessage, toAbsoluteAssetUrl, truncateId } from "./chatUtils.js";

export default function RightPanel({
	activeThread,
	activeAvatar,
	activeThreadDisplayName,
	isLight,
	theme,
	leadLoading,
	prequal,
	aiSummary,
	aiSummaryLoading,
	aiSummaryError,
	aiNegotiation,
	aiNegotiationLoading,
	aiNegotiationError,
	accordionState,
	setAccordionState,
	sharedMedia,
	sharedLinks,
	sharedPosts,
	requestAiSummary,
	requestNegotiationHelper,
	openAttachmentPreview,
}) {
	const activeThreadInitials = getInitials(activeThreadDisplayName);

	return (
		<aside
			data-lenis-prevent={true}
			class="hidden xl:block rounded-[24px] p-6 h-full overflow-auto shadow-borderless dark:shadow-borderlessDark"
			style={{ background: theme.panelBg, boxShadow: theme.shadow }}
		>
			{activeThread ? (
				<>
					<div class="mb-8 text-center">
						<div class="mx-auto mb-4 h-24 w-24 rounded-full shadow-md">
							{activeAvatar ? (
								<img
									src={activeAvatar}
									alt={activeThreadDisplayName}
									class="h-full w-full rounded-full object-cover"
								/>
							) : (
								<div class="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400">
									{activeThreadInitials}
								</div>
							)}
						</div>
						<h3 class="text-lg font-bold tracking-tight">{activeThreadDisplayName}</h3>
						<p class="text-xs font-medium text-slate-400 tracking-wide">
							@{truncateId(activeThread.senderId || activeThread.matchId, 16)}
						</p>
					</div>

					{leadLoading ? (
						<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
					) : prequal ? (
						<div class="mb-6 rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
							<p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
								AI Pre-Qual Summary
							</p>
							<p class="mt-1">
								Score: <span class="font-semibold">{prequal.score ?? "--"}</span>
							</p>
							<p class="mt-1">Missing: {prequal.missing || "None"}</p>
						</div>
					) : null}

					<div class="mb-6 rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
						<div class="flex items-center justify-between gap-2">
							<p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
								AI Conversation Summary
							</p>
							<button
								type="button"
								onClick={requestAiSummary}
								disabled={aiSummaryLoading || !activeThread?.matchId}
								class="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
							>
								{aiSummaryLoading ? (
									<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
								) : (
									"Refresh"
								)}
							</button>
						</div>
						{aiSummaryError ? (
							<div class="mt-2 text-[10px] font-semibold text-rose-600">{aiSummaryError}</div>
						) : null}
						{aiSummary?.text ? (
							<>
								<p class="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">
									{aiSummary.text}
								</p>
								{aiSummary.suggestedReply ? (
									<p class="mt-2 text-[11px] text-slate-500">
										Suggested reply: {aiSummary.suggestedReply}
									</p>
								) : null}
							</>
						) : (
							<p class="mt-2 text-[10px] text-slate-400 italic">No summary yet.</p>
						)}
					</div>

					<div class="mb-6 rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
						<div class="flex items-center justify-between gap-2">
							<p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
								AI Negotiation Helper
							</p>
							<button
								type="button"
								onClick={requestNegotiationHelper}
								disabled={aiNegotiationLoading || !activeThread?.matchId}
								class="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
							>
								{aiNegotiationLoading ? (
									<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
								) : (
									"Generate"
								)}
							</button>
						</div>
						{aiNegotiationError ? (
							<div class="mt-2 text-[10px] font-semibold text-rose-600">{aiNegotiationError}</div>
						) : null}
						{aiNegotiation?.guidance ? (
							<>
								<p class="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">
									{aiNegotiation.guidance}
								</p>
								{aiNegotiation.suggestedReply ? (
									<p class="mt-2 text-[11px] text-slate-500">
										Suggested reply: {aiNegotiation.suggestedReply}
									</p>
								) : null}
							</>
						) : (
							<p class="mt-2 text-[10px] text-slate-400 italic">
								Generate guidance for this thread.
							</p>
						)}
					</div>

					<div class="mb-8 grid grid-cols-4 gap-3">
						{[
							{ icon: Flag, title: "Report" },
							{ icon: Lock, title: "Block" },
							{ icon: Info, title: "Info" },
							{ icon: VolumeX, title: "Mute" },
						].map((action, i) => (
							<button
								key={i}
								class="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70"
								title={action.title}
							>
								<div class="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
									<action.icon size={16} strokeWidth={2} />
								</div>
							</button>
						))}
					</div>

					<div class="space-y-4">
						{[
							{
								id: "sharedDocument",
								label: "Documents",
								count: sharedLinks.length,
								icon: FolderOpen,
							},
							{
								id: "sharedMedia",
								label: "Media",
								count: sharedMedia.length,
								icon: Search,
							},
							{
								id: "sharedPost",
								label: "Posts",
								count: sharedPosts.length,
								icon: Home,
							},
						].map((section) => (
							<div
								key={section.id}
								class="overflow-hidden rounded-[18px] shadow-borderless dark:shadow-borderlessDark"
							>
								<button
									class="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
									style={{
										background: isLight ? "#f8fafc" : "#101328",
										color: theme.textMuted,
									}}
									onClick={() =>
										setAccordionState((prev) => ({
											...prev,
											[section.id]: !prev[section.id],
										}))
									}
								>
									<div class="flex items-center gap-2">
										<section.icon size={14} class="opacity-50" />
										<span>
											{section.label} <span class="ml-1 opacity-50">({section.count})</span>
										</span>
									</div>
									{accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
								</button>
								{accordionState[section.id] && (
									<div class="p-3 bg-white dark:bg-transparent">
										{section.id === "sharedDocument" && (
											<div class="space-y-2">
												{sharedLinks.length > 0 ? (
													sharedLinks.map((item) => {
														const url = toAbsoluteAssetUrl(item.attachment?.url || "");
														return (
															<button
																key={item.id}
																type="button"
																onClick={() => openAttachmentPreview(item.attachment, url)}
																class="flex w-full items-center gap-2 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors dark:bg-slate-800/30"
																title="Preview"
															>
																<div class="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700">
																	<Plus size={12} class="opacity-30" />
																</div>
																<span class="truncate flex-1">
																	{item.attachment?.name || "File"}
																</span>
															</button>
														);
													})
												) : (
													<p class="text-[10px] text-slate-400 italic text-center py-2">
														No documents shared
													</p>
												)}
											</div>
										)}
										{section.id === "sharedMedia" && (
											<div class="grid grid-cols-3 gap-1.5">
												{sharedMedia.length > 0 ? (
													sharedMedia.slice(0, 6).map((item) => {
														const url = toAbsoluteAssetUrl(item.attachment?.url || "");
														const isVideo = isVideoMessage(item);
														return (
															<button
																key={item.id}
																type="button"
																onClick={() => openAttachmentPreview(item.attachment, url)}
																class="relative aspect-square overflow-hidden rounded-lg"
																title="View"
															>
																{isVideo ? (
																	<>
																		<video
																			src={url}
																			muted={true}
																			playsInline={true}
																			preload="metadata"
																			class="h-full w-full object-cover"
																		/>
																		<div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
																			<div class="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">
																				Play
																			</div>
																		</div>
																	</>
																) : (
																	<img
																		src={url}
																		alt=""
																		class="h-full w-full object-cover transition-transform hover:scale-110"
																	/>
																)}
															</button>
														);
													})
												) : (
													<p class="col-span-3 text-[10px] text-slate-400 italic text-center py-2">
														No media shared
													</p>
												)}
											</div>
										)}
										{section.id === "sharedPost" && (
											<div class="space-y-2">
												{sharedPosts.length > 0 ? (
													sharedPosts.map((item) => (
														<div
															key={item.id}
															style={{
																background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.03)",
															}}
														>
															<p class="line-clamp-2 leading-relaxed opacity-80">{item.message}</p>
														</div>
													))
												) : (
													<p class="text-[10px] text-slate-400 italic text-center py-2">
														No posts shared
													</p>
												)}
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</>
			) : (
				<div class="flex h-full flex-col items-center justify-center text-slate-400 text-xs italic">
					Details will appear here
				</div>
			)}
		</aside>
	);
}
