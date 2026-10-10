import {
	createThemeHotkeyState,
	THEME_HOTKEY_WINDOW_MS,
	THEME_HOTKEY_WORD,
	trackThemeHotkey,
} from "../../src/lib/themeHotkey.js";

function typeWord(state, word, { startAt = 1000, stepMs = 100, flags = {} } = {}) {
	let fired = false;
	[...word].forEach((key, i) => {
		fired = trackThemeHotkey(state, {
			key,
			repeat: false,
			metaKey: false,
			ctrlKey: false,
			altKey: false,
			now: startAt + i * stepMs,
			...flags,
		});
	});
	return fired;
}

describe("theme hotkey detector (src/lib/themeHotkey.js)", () => {
	test("fires when 'themes' is typed within the window", () => {
		expect(THEME_HOTKEY_WORD).toBe("themes");
		expect(THEME_HOTKEY_WINDOW_MS).toBe(3600);
		const state = createThemeHotkeyState();
		expect(typeWord(state, "themes")).toBe(true);
	});

	test("is case-insensitive", () => {
		const state = createThemeHotkeyState();
		expect(typeWord(state, "ThEmEs")).toBe(true);
	});

	test("does not fire for partial or wrong words", () => {
		expect(typeWord(createThemeHotkeyState(), "theme")).toBe(false);
		expect(typeWord(createThemeHotkeyState(), "stream")).toBe(false);
		expect(typeWord(createThemeHotkeyState(), "themez")).toBe(false);
	});

	test("ignores auto-repeat, modifiers, and non-character keys", () => {
		const state = createThemeHotkeyState();
		for (const key of ["t", "h", "e", "m", "e"]) {
			trackThemeHotkey(state, {
				key,
				repeat: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false,
				now: 1000,
			});
		}
		// auto-repeat 's' must not complete the word
		expect(
			trackThemeHotkey(state, {
				key: "s",
				repeat: true,
				metaKey: false,
				ctrlKey: false,
				altKey: false,
				now: 1100,
			}),
		).toBe(false);
		// ctrl-modified 's' must not complete the word either
		expect(
			trackThemeHotkey(state, {
				key: "s",
				repeat: false,
				metaKey: false,
				ctrlKey: true,
				altKey: false,
				now: 1200,
			}),
		).toBe(false);
		expect(
			trackThemeHotkey(createThemeHotkeyState(), {
				key: "Enter",
				repeat: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false,
				now: 1000,
			}),
		).toBe(false);
	});

	test("does not fire when typing exceeds the time window", () => {
		const state = createThemeHotkeyState();
		expect(typeWord(state, "themes", { stepMs: THEME_HOTKEY_WINDOW_MS })).toBe(false);
	});

	test("resets the buffer after firing so the word can trigger again", () => {
		const state = createThemeHotkeyState();
		expect(typeWord(state, "themes")).toBe(true);
		expect(state.buffer).toHaveLength(0);
		expect(typeWord(state, "themes")).toBe(true);
	});
});
