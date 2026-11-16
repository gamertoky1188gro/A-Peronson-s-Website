import { ChevronLeft, ChevronRight, Download, FileText, Minus, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn.js";
import { formatBytes } from "../../lib/formatBytes.js";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;
const clampZoom = (value) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));

/**
 * Lightbox for evidence files. Zoom is 0.5–4 via wheel or the +/- buttons;
 * drag pans; arrow keys move between items; Escape (or the backdrop) closes.
 * The zoom/pan transform lives on an inner wrapper inside an overflow-hidden
 * stage so the clipping box never moves with the content.
 *
 * @param {Object} props
 * @param {{ url: string, name: string, type?: string, size?: number }[]} props.items
 * @param {number} props.index - Controlled index of the visible item.
 * @param {() => void} props.onClose
 * @param {(nextIndex: number) => void} props.onNavigate - Asks the parent to show a different item.
 */
export function EvidenceViewerModal({ items = [], index = 0, onClose, onNavigate }) {
	const [zoom, setZoom] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const dragRef = useRef(null);
	const stageRef = useRef(null);
	const item = items[index] ?? null;

	const navigate = useCallback(
		(delta) => {
			const next = index + delta;
			if (next >= 0 && next < items.length) {
				onNavigate?.(next);
			}
		},
		[index, items.length, onNavigate],
	);

	useEffect(() => {
		setZoom(1);
		setOffset({ x: 0, y: 0 });
	}, [index]);

	useEffect(() => {
		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose?.();
			} else if (event.key === "ArrowLeft") {
				navigate(-1);
			} else if (event.key === "ArrowRight") {
				navigate(1);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [navigate, onClose]);

	// Wheel must be non-passive so preventDefault stops the page scrolling.
	// `item` is a dep: the stage only renders once an item exists, so the
	// listener binds (and re-binds) against live content, not a null ref.
	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) {
			return undefined;
		}
		const onWheel = (event) => {
			event.preventDefault();
			setZoom((value) => clampZoom(value + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)));
		};
		stage.addEventListener("wheel", onWheel, { passive: false });
		return () => stage.removeEventListener("wheel", onWheel);
	}, [item]);

	if (!item) {
		return null;
	}
	const type = String(item.type ?? "");
	const onPointerDown = (event) => {
		dragRef.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
		setDragging(true);
		event.currentTarget.setPointerCapture(event.pointerId);
	};
	const onPointerMove = (event) => {
		if (dragRef.current) {
			setOffset({ x: event.clientX - dragRef.current.x, y: event.clientY - dragRef.current.y });
		}
	};
	const onPointerUp = () => {
		dragRef.current = null;
		setDragging(false);
	};
	const navButton =
		"rounded-full border border-white/10 bg-white/5 p-2 text-[#f4eeff] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-label={`Evidence viewer: ${item.name}`}
			onClick={onClose}
		>
			<div
				className="relative flex h-full w-full max-w-6xl flex-col p-4"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-center justify-between gap-3 pb-3">
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-[#f4eeff]">{item.name}</p>
						<p className="text-[11px] tabular-nums text-[#a99bbd]">
							{index + 1} of {items.length}
							{item.size ? ` · ${formatBytes(item.size)}` : ""}
						</p>
					</div>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
							aria-label="Zoom out"
							className={navButton}
						>
							<Minus aria-hidden="true" className="h-4 w-4" />
						</button>
						<span className="w-12 text-center text-xs tabular-nums text-[#a99bbd]">
							{Math.round(zoom * 100)}%
						</span>
						<button
							type="button"
							onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
							aria-label="Zoom in"
							className={navButton}
						>
							<Plus aria-hidden="true" className="h-4 w-4" />
						</button>
						<a
							href={item.url}
							download={item.name}
							aria-label="Download file"
							className={navButton}
						>
							<Download aria-hidden="true" className="h-4 w-4" />
						</a>
						<button type="button" onClick={onClose} aria-label="Close" className={navButton}>
							<X aria-hidden="true" className="h-4 w-4" />
						</button>
					</div>
				</div>

				<div
					ref={stageRef}
					className="relative flex-1 touch-none overflow-hidden rounded-2xl border border-white/10 bg-[#0b0714]"
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
				>
					<div
						data-testid="evidence-viewer-stage"
						className="flex h-full w-full items-center justify-center"
						style={{
							transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
							cursor: dragging ? "grabbing" : "grab",
						}}
					>
						{type.startsWith("image/") ? (
							<img
								src={item.url}
								alt={item.name}
								className="h-full w-full object-contain select-none"
								draggable={false}
							/>
						) : type.startsWith("video/") ? (
							<video src={item.url} controls className="h-full w-full object-contain" />
						) : (
							<div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
								<FileText aria-hidden="true" className="h-12 w-12 text-cyan-300/70" />
								<p className="text-sm text-[#f4eeff]">{item.name}</p>
								<a
									href={item.url}
									download={item.name}
									className="text-xs text-cyan-300 underline-offset-2 hover:underline"
								>
									Download to view
								</a>
							</div>
						)}
					</div>
				</div>

				{items.length > 1 ? (
					<>
						<button
							type="button"
							onClick={() => navigate(-1)}
							disabled={index === 0}
							aria-label="Previous evidence"
							className={cn(navButton, "absolute left-2 top-1/2 -translate-y-1/2")}
						>
							<ChevronLeft aria-hidden="true" className="h-5 w-5" />
						</button>
						<button
							type="button"
							onClick={() => navigate(1)}
							disabled={index >= items.length - 1}
							aria-label="Next evidence"
							className={cn(navButton, "absolute right-2 top-1/2 -translate-y-1/2")}
						>
							<ChevronRight aria-hidden="true" className="h-5 w-5" />
						</button>
					</>
				) : null}
			</div>
		</div>
	);
}
