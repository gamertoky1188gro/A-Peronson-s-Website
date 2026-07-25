import { Search } from "lucide-react";
import { Mosaic } from "react-loading-indicators";
import { List } from "react-window";
import { avatarUrl, formatDisplayName, formatTime, getInitials } from "./chatUtils.js";

export default function ThreadList({
	query,
	setQuery,
	allVisibleThreads,
	loading,
	visibleError,
	activeThreadId,
	setActiveThreadId,
	presenceStatus,
	isLight,
	theme,
}) {
	return (
		<aside
			class="hidden lg:block rounded-[24px] p-5 overflow-hidden shadow-borderless dark:shadow-borderlessDark"
			style={{ background: theme.panelBg, boxShadow: theme.shadow }}
		>
			<div class="mb-6">
				<h2 class="text-xl font-bold tracking-tight">Messages</h2>
				<p class="text-xs font-medium" style={{ color: theme.textMuted }}>
					No email available
				</p>
			</div>

			<div class="relative mb-6">
				<Search size={15} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
				<input
					class="h-11 w-full appearance-none rounded-[14px] shadow-borderless dark:shadow-borderlessDark pl-10 pr-11 text-[13px] outline-none transition-all"
					style={{ background: theme.inputBg, color: theme.textPrimary }}
					placeholder="Search conversations..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
			</div>

			<div class="mb-3 flex items-center justify-between px-1">
				<h3 class="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
					Direct Messages
				</h3>
				<span class="text-[10px] font-bold text-gtBlue">{allVisibleThreads.length}</span>
			</div>

			<div
				data-lenis-prevent={true}
				class="h-[calc(100vh-250px)] overflow-auto pr-1 custom-scrollbar"
			>
				{loading ? (
					<Mosaic color="#3b00ff" size="large" style={{ fontSize: "40px" }} text="" textColor="" />
				) : null}
				{!loading && visibleError ? (
					<div class="p-4 text-center text-sm text-red-400">{visibleError}</div>
				) : null}
				{!(loading || visibleError) && allVisibleThreads.length > 0 ? (
					<List
						height={typeof window === "undefined" ? 600 : window.innerHeight - 250}
						itemCount={allVisibleThreads.length}
						itemSize={82}
						width="100%"
						overscanCount={5}
					>
						{({ index, style }) => {
							const thread = allVisibleThreads[index];
							const threadName = formatDisplayName(thread.name, thread.senderId || thread.id);
							const isActive = activeThreadId === thread.id;
							const hasUnread = Number(thread.unread || 0) > 0;
							const isFriendRequest =
								thread.isFriendThread && thread.friendRequestStatus === "pending";
							return (
								<div style={style} class="pb-1">
									<button
										key={thread.id}
										class={`group w-full rounded-[16px] px-3 py-3 text-left transition-all${hasUnread && !isActive ? "ring-1 ring-gtBlue/20" : ""}${isFriendRequest ? " ring-2 ring-violet-400/30" : ""}`}
										style={{
											background: isActive
												? theme.threadActiveBg
												: hasUnread
													? isLight
														? "#eef6ff"
														: "#1b1f3b"
													: "transparent",
										}}
										onClick={() => setActiveThreadId(thread.id)}
									>
										<div class="flex items-center gap-3">
											<div class="relative flex-shrink-0">
												{thread.avatar ? (
													<img
														src={avatarUrl(thread.avatar)}
														alt={threadName}
														class="h-11 w-11 rounded-full object-cover shadow-sm"
													/>
												) : (
													<div
														class={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm${isActive ? "bg-gtBlue text-white" : "bg-slate-100 text-slate-500"}`}
													>
														{getInitials(threadName)}
													</div>
												)}
												<span
													class="absolute bottom-0 right-0 h-3 w-3 rounded-full"
													style={{
														background:
															presenceStatus(thread.senderId) === "online" ? "#22c55e" : "#94a3b8",
														boxShadow: `0 0 0 2px ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.18)"}`,
													}}
												/>
											</div>
											<div class="min-w-0 flex-1">
												<div class="flex items-center justify-between gap-1">
													<p
														class={`truncate text-[14px] font-semibold${isActive ? "text-gtBlue" : ""}`}
													>
														{threadName}
													</p>
													<div class="ml-2 flex flex-shrink-0 items-center gap-1">
														{thread.isFriendThread ? (
															<span class="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold uppercase text-violet-700">
																Request
															</span>
														) : null}
														{thread.policyStatus && thread.policyStatus !== "delivered" ? (
															<span class="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
																Queued
															</span>
														) : null}
														{thread.policyPriority ? (
															<span class="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">
																{thread.policyPriority}
															</span>
														) : null}
														<span class="text-[10px] font-medium text-slate-400">
															{formatTime(thread.timestamp)}
														</span>
													</div>
												</div>
												<div class="flex items-center justify-between gap-2">
													<p
														class={`truncate text-xs${isActive ? "text-slate-600" : hasUnread ? "text-slate-700" : "text-slate-400"}`}
													>
														{thread.last || "No messages"}
													</p>
													{hasUnread ? (
														<span class="min-w-[18px] rounded-full bg-gtBlue px-2 py-0.5 text-[10px] font-bold text-white">
															{thread.unread}
														</span>
													) : null}
												</div>
											</div>
										</div>
									</button>
								</div>
							);
						}}
					</List>
				) : !(loading || visibleError) && allVisibleThreads.length === 0 ? (
					<div class="p-4 text-center text-sm text-slate-400">No conversations</div>
				) : null}
			</div>
		</aside>
	);
}
