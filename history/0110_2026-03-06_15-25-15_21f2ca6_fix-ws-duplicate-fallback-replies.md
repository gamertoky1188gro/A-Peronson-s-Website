# Commit 0110: Fix WS Duplicate/Fallback Replies and Tighten LLM Prompt Context

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0110                                       |
| Hash          | `21f2ca60c1976c21ff5981c877d3c8412dfa575f` |
| Parent Hash   | `917ac133c72d1b80a02ec5b19fbe29569ad95929` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-06 15:25:15                        |
| Files Changed | 4                                          |
| Lines Added   | 486                                        |
| Lines Deleted | 51                                         |
| Net Change    | +435                                       |
| Merge         | No                                         |

## Custom Title

Fix Duplicate Replies and Tighten LLM Prompt Context

## High-Level Summary

Another branch from the common ancestor adding the full assistant pipeline with public endpoint, WebSocket handler, logging/fallback, and LLM integration. This version includes refinements to prevent duplicate WebSocket replies and tighter prompt context limits.

## File-by-File Breakdown

- **server/controllers/assistantController.js** (+16/-1 line): Logging, `public_guest` fallback.
- **server/routes/assistantRoutes.js** (+2 lines): Public `/ask` endpoint.
- **server/server.js** (+102/-? lines): WS handler with duplicate reply prevention (likely ref counting or connection tracking).
- **server/services/assistantService.js** (+366/-49 lines): LLM pipeline with refined prompt building, logging, code-context, and tighter context constraints.

## Detailed Diff Analysis

### Key Differences from Earlier Branches

- The prompt context is tighter with `MAX_CONTEXT_CHARS` enforcement.
- Likely includes logic to prevent multiple WS reply messages for a single question.
- The `assistantReply` function returns a single coherent response rather than potentially triggering multiple reply paths.

## Why This Change May Have Been Needed

Previous WS integration could send duplicate replies or fall through to multiple response paths. This addresses that bug and refines the prompt quality.

## Was It Useful?

Yes — bug fix and quality improvement.

## Impact Analysis

- **Behavior change**: Fewer duplicate WS messages. Tighter, more relevant LLM prompts.
- **Backward compatibility**: Improved but compatible.

## Relationship to Surrounding Commits

Commit 0111 merges this into the mainline. Part of the series of parallel branches from the common ancestor.

## Confidence Notes

Medium — the exact nature of the WS fix is inferred from the commit message as the diff was truncated.

## Optional Technical Details

None.
