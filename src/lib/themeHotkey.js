/**
 * "themes" hotkey detector (pure logic, tested in themeRegression.test.js).
 *
 * Fires when the word "themes" is typed anywhere within THEME_HOTKEY_WINDOW_MS.
 * Case-insensitive. Ignores auto-repeat, modifier combos, and non-character keys.
 */

export const THEME_HOTKEY_WORD = "themes";
export const THEME_HOTKEY_WINDOW_MS = 3600;

/**
 * Feed one key event into the tracker.
 * @param {{buffer: Array<{key: string, at: number}>}} state mutable tracker state
 * @param {{key: string, repeat: boolean, metaKey: boolean, ctrlKey: boolean, altKey: boolean, now: number}} e
 * @returns {boolean} true when the hotkey just completed
 */
export function trackThemeHotkey(state, e) {
	if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return false;
	if (typeof e.key !== "string" || e.key.length !== 1) return false;
	state.buffer.push({ key: e.key.toLowerCase(), at: e.now });
	while (state.buffer.length > THEME_HOTKEY_WORD.length) state.buffer.shift();
	if (state.buffer.length < THEME_HOTKEY_WORD.length) return false;
	const word = state.buffer.map((k) => k.key).join("");
	if (word !== THEME_HOTKEY_WORD) return false;
	const span = state.buffer[state.buffer.length - 1].at - state.buffer[0].at;
	if (span > THEME_HOTKEY_WINDOW_MS) return false;
	state.buffer.length = 0;
	return true;
}

export function createThemeHotkeyState() {
	return { buffer: [] };
}
