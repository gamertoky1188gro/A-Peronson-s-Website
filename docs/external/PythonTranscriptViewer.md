# Python Transcript Viewer

**Location:** `codex-transcript-viewer/`

## Purpose

Parse and view Codex CLI JSONL session transcripts with:
- JSONL parsing
- Conversation extraction
- Markdown rendering
- HTML output generation

## Module Structure

```
codex-transcript-viewer/
├── src/codex_transcript_viewer/
│   ├── __init__.py          # Package init (empty)
│   ├── cli.py               # CLI entry point
│   ├── formatting.py        # Text formatting utilities
│   ├── html_builder.py     # HTML output builder
│   ├── markdown.py         # Markdown renderer
│   └── parser.py            # JSONL parser
├── tests/                   # Unit tests
├── pyproject.toml          # Project config
└── README.md               # Documentation
```

## Key Functions

### parser.py

| Function | Description |
|----------|-------------|
| `parse_jsonl(path)` | Read JSONL file, return list of parsed JSON |
| `extract_conversation(entries)` | Extract session metadata and conversation events |
| `_as_text(value)` | Normalize payload fields to text |
| `_has_positive_usage(total)` | Check for positive token usage |

### formatting.py

- Text formatting utilities for transcript display

### html_builder.py

- HTML output generation from parsed transcripts

### markdown.py

- Markdown rendering for transcript content

## Usage

```bash
# Install
pip install -e .

# Run CLI
codex-transcript-viewer parse input.jsonl
codex-transcript-viewer render input.jsonl -o output.html
```

## Dependencies

- Python 3.10+
- Standard library: json, pathlib, typing

---

*Generated from source: codex-transcript-viewer/*