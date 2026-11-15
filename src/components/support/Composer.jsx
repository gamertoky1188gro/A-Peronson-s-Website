import { FileText, Paperclip, SendHorizontal, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn.js";
import { formatBytes } from "../../lib/formatBytes.js";

const MAX_AUTOGROW_PX = 160;

/**
 * Case composer: autogrowing textarea, drag/drop + paste file intake, a
 * pending-attachment strip with per-file remove. Enter sends (trimmed text
 * plus the pending files) and clears the composer; Shift+Enter inserts a
 * newline. `attachVisible={false}` hides the attach button for signed-out
 * buyers. `onFiles` is notified with the full pending list on every change.
 *
 * @param {Object} props
 * @param {(text: string, files: File[]) => void} props.onSend
 * @param {(files: File[]) => void} [props.onFiles]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.sending] - Swaps the send button for a stop button.
 * @param {() => void} [props.onStop]
 * @param {boolean} [props.attachVisible] - Default true.
 * @param {string} [props.className]
 */
export function Composer({
	onSend,
	onFiles,
	disabled = false,
	sending = false,
	onStop,
	attachVisible = true,
	className,
}) {
	const [draft, setDraft] = useState("");
	const [attachments, setAttachments] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const textareaRef = useRef(null);
	const fileInputRef = useRef(null);

	const resize = useCallback(() => {
		const node = textareaRef.current;
		if (node) {
			node.style.height = "auto";
			node.style.height = `${Math.min(node.scrollHeight, MAX_AUTOGROW_PX)}px`;
		}
	}, []);
	useEffect(resize, [draft, resize]);

	const applyAttachments = useCallback(
		(next) => {
			setAttachments(next);
			onFiles?.(next);
		},
		[onFiles],
	);

	const addFiles = useCallback(
		(fileList) => {
			const files = Array.from(fileList ?? []).filter((file) => file instanceof File);
			if (files.length > 0) {
				applyAttachments([...attachments, ...files]);
			}
		},
		[attachments, applyAttachments],
	);

	const send = useCallback(() => {
		const text = draft.trim();
		if (disabled || sending || (!text && attachments.length === 0)) {
			return;
		}
		onSend?.(text, attachments);
		setDraft("");
		applyAttachments([]);
	}, [draft, attachments, disabled, sending, onSend, applyAttachments]);

	const canSend = !disabled && !sending && (draft.trim().length > 0 || attachments.length > 0);
	const iconButton =
		"rounded-xl border p-2 transition disabled:cursor-not-allowed disabled:opacity-40";

	return (
		<div
			className={cn(
				"rounded-2xl border bg-[#0a1025]/85 backdrop-blur-md transition-colors",
				dragActive ? "border-cyan-400/50" : "border-white/10",
				className,
			)}
			onDragOver={(event) => {
				event.preventDefault();
				setDragActive(true);
			}}
			onDragLeave={() => setDragActive(false)}
			onDrop={(event) => {
				event.preventDefault();
				setDragActive(false);
				addFiles(event.dataTransfer?.files);
			}}
		>
			{attachments.length > 0 ? (
				<ul className="flex flex-wrap gap-1.5 border-b border-white/5 px-3 pt-3">
					{attachments.map((file, index) => (
						<li
							key={`${file.name}-${file.size}-${index}`}
							className="flex max-w-[220px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1 pl-2 pr-1 text-xs text-[#e8eefc]"
						>
							<FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
							<span className="truncate">{file.name}</span>
							{file.size ? (
								<span className="shrink-0 text-[10px] tabular-nums text-[#8ea3c8]">
									{formatBytes(file.size)}
								</span>
							) : null}
							<button
								type="button"
								onClick={() => applyAttachments(attachments.filter((_, i) => i !== index))}
								aria-label={`Remove ${file.name}`}
								className="shrink-0 rounded p-0.5 text-[#8ea3c8] transition hover:bg-white/10 hover:text-[#e8eefc]"
							>
								<X aria-hidden="true" className="h-3.5 w-3.5" />
							</button>
						</li>
					))}
				</ul>
			) : null}

			<div className="flex items-end gap-2 p-2">
				{attachVisible ? (
					<>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={disabled}
							aria-label="Attach files"
							className={cn(
								iconButton,
								"border-white/10 bg-white/5 text-[#8ea3c8] hover:bg-white/10 hover:text-[#e8eefc]",
							)}
						>
							<Paperclip aria-hidden="true" className="h-4 w-4" />
						</button>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							className="hidden"
							onChange={(event) => {
								addFiles(event.target.files);
								event.target.value = "";
							}}
						/>
					</>
				) : null}

				<textarea
					ref={textareaRef}
					value={draft}
					disabled={disabled}
					rows={1}
					aria-label="Message"
					placeholder="Describe the issue…"
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							send();
						}
					}}
					onPaste={(event) => addFiles(event.clipboardData?.files)}
					className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-6 text-[#e8eefc] outline-none placeholder:text-[#8ea3c8]/60 disabled:cursor-not-allowed disabled:opacity-50"
				/>

				{sending ? (
					<button
						type="button"
						onClick={onStop}
						aria-label="Stop generating"
						className={cn(
							iconButton,
							"border-rose-400/30 bg-rose-400/10 text-rose-300 hover:bg-rose-400/20",
						)}
					>
						<Square aria-hidden="true" className="h-4 w-4" />
					</button>
				) : (
					<button
						type="button"
						onClick={send}
						disabled={!canSend}
						aria-label="Send message"
						className={cn(
							iconButton,
							"border-cyan-400/40 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 text-cyan-300 hover:from-cyan-400/30 hover:to-sky-400/30",
						)}
					>
						<SendHorizontal aria-hidden="true" className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	);
}
