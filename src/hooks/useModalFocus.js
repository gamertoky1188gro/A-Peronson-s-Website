import { useEffect } from "react";

// Focus management for modal surfaces (drawers, viewer modals, dialogs).
//
// A modal that does not own focus is not a modal: keyboard users can Tab out
// into the page behind it, screen readers do not know it opened, and closing
// it leaves focus nowhere. Three things happen here:
//
//  - the panel is focused when the modal opens (its first focusable element)
//  - Tab / Shift+Tab cycle inside the panel (trap)
//  - Escape closes the modal, and focus returns to the element that opened it
//
// `open` is the modal's own visibility flag; the hook no-ops while closed.

const FOCUSABLE = [
	"a[href]",
	"button:not([disabled])",
	"textarea:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	'[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * @param {boolean} open
 * @param {React.RefObject<HTMLElement>} panelRef The modal's root element.
 * @param {() => void} [onEscape] Called when Escape is pressed inside the panel.
 * @param {React.RefObject<HTMLElement>} [returnFocusRef] Element that opened the
 *   modal and should get focus back. Falls back to document.activeElement.
 */
export function useModalFocus(open, panelRef, onEscape, returnFocusRef) {
	useEffect(() => {
		if (!open) {
			return;
		}
		const panel = panelRef.current;
		if (!panel) {
			return;
		}
		const opener = returnFocusRef?.current ?? document.activeElement ?? null;

		const focusables = () =>
			Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
				(el) => el.offsetParent !== null || el === document.activeElement,
			);

		const raf = requestAnimationFrame(() => {
			focusables()[0]?.focus?.();
		});

		function onKeyDown(event) {
			if (event.key === "Escape" && onEscape) {
				event.stopPropagation();
				onEscape();
				return;
			}
			if (event.key !== "Tab") {
				return;
			}
			const items = focusables();
			if (items.length === 0) {
				event.preventDefault();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}

		panel.addEventListener("keydown", onKeyDown, true);
		// Make the panel itself tabbable so the trap has a landing spot when
		// the panel is empty of focusable children.
		const hadTabIndex = panel.hasAttribute("tabindex");
		if (!hadTabIndex) {
			panel.setAttribute("tabindex", "-1");
		}

		return () => {
			cancelAnimationFrame(raf);
			panel.removeEventListener("keydown", onKeyDown, true);
			if (!hadTabIndex) {
				panel.removeAttribute("tabindex");
			}
			opener?.focus?.();
		};
	}, [open, panelRef, onEscape, returnFocusRef]);
}
