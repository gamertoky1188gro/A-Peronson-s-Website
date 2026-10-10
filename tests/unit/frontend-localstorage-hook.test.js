/**
 * @jest-environment allure-jest/jsdom
 */
import { act, renderHook } from "@testing-library/react";
import useLocalStorageState from "../../src/hooks/useLocalStorageState.js";

describe("useLocalStorageState (src/hooks/useLocalStorageState.js)", () => {
	// NOTE: object initial values must be referentially stable across renders.
	// Inline literals would change identity every render and retrigger the
	// hook's sync effect forever (production callers pass stable values).
	const STABLE_EMPTY = {};
	const STABLE_FALLBACK = { mode: "fallback" };

	beforeEach(() => {
		window.localStorage.clear();
	});

	test("initializes from the provided initial value when storage is empty", () => {
		const { result } = renderHook(() => useLocalStorageState("test:key", "default"));
		expect(result.current[0]).toBe("default");
	});

	test("initializes from stored JSON when present", () => {
		window.localStorage.setItem("test:key", JSON.stringify({ theme: "dark" }));
		const { result } = renderHook(() => useLocalStorageState("test:key", STABLE_EMPTY));
		expect(result.current[0]).toEqual({ theme: "dark" });
	});

	test("falls back to initial value on corrupt stored JSON", () => {
		window.localStorage.setItem("test:key", "{{broken");
		const { result } = renderHook(() => useLocalStorageState("test:key", STABLE_FALLBACK));
		expect(result.current[0]).toBe(STABLE_FALLBACK);
	});

	test("persists updates to localStorage, including functional updates", () => {
		const { result } = renderHook(() => useLocalStorageState("test:key", 0));
		act(() => {
			result.current[1](5);
		});
		expect(result.current[0]).toBe(5);
		expect(JSON.parse(window.localStorage.getItem("test:key"))).toBe(5);

		act(() => {
			result.current[1]((prev) => prev + 1);
		});
		expect(result.current[0]).toBe(6);
	});

	test("works without a key (memory-only state)", () => {
		const { result } = renderHook(() => useLocalStorageState(null, "mem"));
		expect(result.current[0]).toBe("mem");
		act(() => {
			result.current[1]("mem2");
		});
		expect(result.current[0]).toBe("mem2");
	});
});
