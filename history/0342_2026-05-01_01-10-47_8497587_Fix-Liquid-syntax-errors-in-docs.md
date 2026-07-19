# Commit 0342 — Fix Liquid syntax errors in docs

## Commit Metadata

- **Hash:** `84975872e92848f9235a9dd28674ce0c0af988b4`
- **Parent:** `f1bc9d32f9c745acb62b285780d6910afea4f5c6`
- **Author:** Cyber Code Master
- **Date:** 2026-05-01 01:10:47 +0600
- **Message:** Fix Liquid syntax errors in docs

## Custom Title

Add `{% raw %}` tags to prevent Liquid from parsing JSX code blocks

## High-Level Summary

Wrapped JSX code blocks inside `{% raw %}...{% endraw %}` tags across 8 documentation Markdown files to prevent Jekyll/Liquid from incorrectly interpreting JSX template syntax as Liquid tags.

## File-by-File

| File                              | Status   | Changes |
| --------------------------------- | -------- | ------- |
| docs/pages/About.md               | modified | +2      |
| docs/pages/BuyerProfile.md        | modified | +2      |
| docs/pages/BuyingHouseProfile.md  | modified | +2      |
| docs/pages/CallInterface.md       | modified | +4      |
| docs/pages/ContractVault.md       | modified | +2      |
| docs/pages/FactoryProfile.md      | modified | +2      |
| docs/pages/NotificationsCenter.md | modified | +2      |
| docs/pages/SearchResults.md       | modified | +2      |

## Detailed Diff

Each file had `{% raw %}` inserted before JSX fenced code blocks and `{% endraw %}` after them. For example in `docs/pages/About.md`:

````diff
+{% raw %}
 ```jsx
       className={className}
 ...
````

+{% endraw %}

```

## Why
JSX `{{ }}` syntax overlaps with Liquid's template delimiters, causing Jekyll build errors. The `{% raw %}` tag instructs Liquid to pass the content through verbatim.

## Was It Useful
Yes — fixes docs build pipeline.

## Impact
Low. Cosmetic doc changes — no runtime effect.

## Relationships
Follow-up to docs authoring; companion to later Liquid fixes.

## Confidence
High — consistent pattern across all files.
```
