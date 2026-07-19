# Commit 0104: Add LLM Request Logging and Endpoint Fallback for Assistant

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0104                                       |
| Hash          | `84e0fc318b7c90a147c9ba5c02aad0e04f732e5d` |
| Parent Hash   | `917ac133c72d1b80a02ec5b19fbe29569ad95929` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-06 14:13:34                        |
| Files Changed | 2                                          |
| Lines Added   | 364                                        |
| Lines Deleted | 49                                         |
| Net Change    | +315                                       |
| Merge         | No                                         |

## Custom Title

Add Logging and Fallback Endpoint for Assistant LLM

## High-Level Summary

Extended the assistant system with request logging in the controller and added a fallback LLM endpoint in the service. The `assistantService.js` now supports both an OpenAI-compatible endpoint and a legacy `/completion` fallback. Added `logInfo`/`logError` calls for observability. The `orgIdFromUser` function reverted to not use `'public_guest'` fallback.

## File-by-File Breakdown

- **server/controllers/assistantController.js** (+7/-1 line): Added `logInfo` import and request logging when `/ask` is called (logs `org_id` and question length).
- **server/services/assistantService.js** (+357/-48 lines): Added `LOCAL_LLM_FALLBACK_ENDPOINT` for legacy completion API, `logError`/`logInfo` imports, logging throughout the AI generation pipeline, and the full code-context + LLM infrastructure.

## Detailed Diff Analysis

### Controller Changes

- Each `/ask` request is now logged with `org_id` and `question_chars`.

### Service Changes

- Added `LOCAL_LLM_FALLBACK_ENDPOINT` (`http://127.0.0.1:8080/completion`) — if the primary endpoint fails, falls back to the legacy completion format.
- `generateDynamicAnswer` now tries the primary endpoint first, then falls back.
- Added `logInfo`/`logError` calls at key points: AI answer generated, AI call failed, no answer from AI.
- The `buildAgentPrompt` now includes `compact_code_context` with capped length.

## Why This Change May Have Been Needed

Observability was missing for the LLM integration — without logging it's impossible to debug failures. The fallback endpoint ensures compatibility with different llama.cpp versions.

## Was It Useful?

Yes — logging is essential for production debugging. The fallback improves reliability.

## Impact Analysis

- **Behavior change**: Requests are now logged. LLM endpoint fallback is automatic.
- **Backward compatibility**: No breaking changes.

## Relationship to Surrounding Commits

Commit 0105 is a merge ("meow") that brings this into the mainline. This commit diverges from the same parent as 0102.

## Confidence Notes

High confidence.

## Optional Technical Details

The fallback endpoint uses the legacy `/completion` API (non-chat format) which some llama.cpp builds still support.
