# .opencode — agent definitions only, never project policy

This directory is committed so the investigation runtime and the support
assistant can run as pinned, read-only agents. It is intentionally NOT a
policy for every opencode session started in this repository.

- `opencode.json` declares `$schema` and nothing else. Do not add
  `default_agent`, `permission`, or `mcp` here: opencode v2 reads this file
  for ANY opencode started in this repository, including the operator's own
  session. Restrictions belong to the agents that need them.
- `agents/investigator.md` and `agents/assistant.md` carry the full
  deny-first permission set in their frontmatter (`"*": deny`, read allow
  with `.env` denied at `*.env`, `**/.env`, NO shell of any kind,
  MCP tool allowlists, no edit/write/patch/bash/web/subagents/question).
  These rules apply only when a session runs that agent — the investigation
  runtime pins `agent: "investigator"` at session creation
  (`server/services/investigation/opencodeRuntime.js`) and the assistant
  pins `agent: "assistant"` (`server/services/assistantService.js`).
  Sessions created without that pin (e.g. the operator's own opencode) are
  completely unaffected by these files.
- `opencode.mcp.optional.json` is the opt-in MCP server block for
  investigations (github, parallel-search, render, context7; credentials
  only via `{env:NAME}` interpolation). It is NOT merged into
  `opencode.json` on purpose: opencode has no per-agent MCP declaration, so
  merging it registers the servers for every opencode run in this
  repository, including the operator's. To enable investigation MCP, copy
  the `mcp` object into `.opencode/opencode.json` knowingly, set
  `GITHUB_PERSONAL_ACCESS_TOKEN` / `RENDER_API_KEY` / `CONTEXT7_API_KEY` in
  the environment, and re-run the live read-only probe. Until that is done,
  the investigator's MCP tool allowlist entries are inert — the tools do
  not exist — and investigations run repository reads only.
