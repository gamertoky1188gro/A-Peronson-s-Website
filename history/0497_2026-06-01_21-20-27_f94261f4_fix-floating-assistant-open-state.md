# Commit 0497

## Commit Metadata

- **Hash**: `f94261f4534bf049fcfd06b11c020bf6bdfb5d7b`
- **Parent**: `3bb82054fd6eecc009f9f603e364dafbec5cd3e9`
- **Author**: gamertoky1188gro
- **Date**: 2026-06-01 21:20:27
- **Message**: Fix FloatingAssistant: move open state before usage

## High-Level Summary

Fixed a Temporal Dead Zone (TDZ) issue in FloatingAssistant — moved the `open` state declaration before the scrollDir hook that references it.

## File-by-File Breakdown

| File                                 | Status   | Insertions | Deletions |
| ------------------------------------ | -------- | ---------- | --------- |
| src/components/FloatingAssistant.jsx | modified | 1          | 1         |

## Detailed Diff Analysis

- Moved `const [open, setOpen] = useState(false)` before the useScrollDirection() call
- scrollDir and buttonVisible reference `open` value

## Why This Change

In JavaScript, const declarations are hoisted but not initialized until the line executes. open was referenced before its useState call, causing a TDZ error.

## Was It Useful

Yes — fixes a runtime crash.

## Impact Analysis

Low. Single line move.

## Relationships

Follow-up fix to 0495 animation changes.

## Confidence Notes

High.
