# .opencode — agent definitions; MCP merged (github, render, parallel-search)

This repo's `.opencode/` is the configuration opencode v2 reads for every
investigation AND every opencode session started here. Treat it accordingly.

- `opencode.json` declares the three owner-approved MCP servers
  (github, render, parallel-search) and nothing else - no `default_agent`,
  no `permission`/`permissions`, nothing that binds other sessions.
  - `github` and `render` use `{env:GITHUB_PERSONAL_ACCESS_TOKEN}` /
    `{env:RENDER_API_KEY}` bearer interpolation. Credentials come from the
    process environment; never inline them in this file.
  - `parallel-search` needs no key.
  - A missing key makes that server unavailable, never less restricted:
    the investigator's deny-first permission set binds every tool call.
- `opencode.mcp.optional.json` holds the `context7` profile. It stays OUT of
  the project config because no `CONTEXT7_API_KEY` exists in the
  investigation environment. Merging it requires the key and an owner call.
- `agents/investigator.md` and `agents/assistant.md` carry the full
  deny-first permission set in their frontmatter (`"*": deny`, read allow
  with `.env` denied at `*.env`/`**/.env`, NO shell of any kind, MCP tool
  allowlists for the investigator, no edit/web/subagents/question). It
  binds only sessions created with `agent: "investigator"` /
  `agent: "assistant"` pinned - the investigation session pin and the
  assistant session pin, in server code. Sessions NOT pinned to those
  agents (e.g. the operator's own opencode) are unaffected except for the
  three MCP servers being discoverable. Investigator sessions expect the
  `OPENCODE_BIN` to point at the v2 binary; V1 is refused by the runtime.
