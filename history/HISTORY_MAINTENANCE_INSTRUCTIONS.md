# Git History Maintenance Agent — Incremental Update Instructions

> Give this file to any AI agent to update `history/` when new commits are added to the repository.
> The agent will detect new commits, document them, and update the index and progress files.

---

## Mission

You are a meticulous Git history analyst and documentation agent tasked with **incrementally updating** an existing commit history record.

A full history already exists in the `history/` folder. Your job is to:

1. Detect any commits that exist in the Git log but are **not yet documented** in `history/`
2. Document only those new commits (one file per commit)
3. Update the index and progress files to reflect the new state

You must **not** re-document already processed commits unless explicitly told to fix something.

---

## How to detect new commits

1. Read `history/progress.md` or `history/progress.json` to find the **last completed commit hash**.
2. Run `git log --reverse --format="%H|%P|%an|%ad|%s" --date=format:"%Y-%m-%d %H:%M:%S"` to list all commits chronologically.
3. Find the position of the last completed commit in that list.
4. Every commit that appears **after** that position is a new, undocumented commit.
5. Assign the next sequential commit number (e.g., if the last was `0588`, new commits start at `0589`, `0590`, etc.).

### Example detection flow

```bash
# Read progress.json to get last hash
LAST_HASH=$(python3 -c "import json; print(json.load(open('history/progress.json'))['lastCompleted']['hash'])")

# Find all commits after that hash
git log --reverse --format="%H" --after=$(git show -s --format=%ci $LAST_HASH)
```

Or more precisely:

```bash
# Get the commit number and hash of the last documented commit
LAST_NUM=$(grep -oP '"number": \K\d+' history/progress.json)
LAST_HASH=$(grep -oP '"hash": "\K[^"]+' history/progress.json)

# List all commits in order, find where we left off
git log --reverse --format="%H|%P|%an|%ad|%s" --date=format:"%Y-%m-%d %H:%M:%S" > /tmp/all_commits.txt
awk -v last="$LAST_HASH" 'found; $1 == last {found=1}' /tmp/all_commits.txt | tail -n +2
```

---

## Required outputs per new commit

For each new commit, create a Markdown file in `history/` with filename format:

```
history/NNNN_YYYY-MM-DD_HH-MM-SS_ABBREV_HASH_descriptive-title.md
```

Where:

- `NNNN` = 4-digit sequential commit number (continuing from existing sequence)
- `YYYY-MM-DD_HH-MM-SS` = commit date/time
- `ABBREV_HASH` = first 7 characters of commit hash
- `descriptive-title` = your own generated kebab-case title (NOT the commit message)

---

## What each commit file must contain

### 1. Commit metadata (table)

```
| Field | Value |
|-------|-------|
| **Commit Number** | NNNN |
| **Commit Hash** | `full_hash` |
| **Parent Hash** | `parent_hash` |
| **Author** | author name |
| **Date/Time** | YYYY-MM-DD HH:MM:SS |
| **Branch** | (if available) |
| **Files Changed** | X |
| **Additions** | X |
| **Deletions** | X |
| **Net Change** | +X/-X |
| **Merge Commit** | Yes/No |
```

### 2. Custom title

A concise title you generate yourself. Do **not** copy the commit message.

Good examples:

- `Add login form validation`
- `Refactor routing to central config`
- `Fix crash when config file is missing`
- `Document deployment workflow`

Bad examples:

- `Update files`
- `Misc changes`
- `Small fixes`

### 3. High-level summary

1–3 paragraphs explaining what the commit did overall. Describe the feature, bug fix, refactor, cleanup, documentation change, or structural change.

### 4. File-by-file breakdown

For each changed file, include:

```
| File | Type | + | - | Δ |
|------|------|---|---|---|
| `path/to/file` | Modified/Added/Deleted | N | N | +N/-N |
```

Then explain:

- What changed in that file
- Why it matters (e.g., "adds new API endpoint", "fixes null pointer", "removes dead code")

### 5. Detailed diff analysis

Explain actual content-level changes:

- Functions/classes/components/modules added, removed, renamed, or rewritten
- Logic changes
- UI/UX changes
- API or data flow changes
- Configuration changes
- Dependency changes
- Test changes
- Build or deployment changes
- Documentation changes
- Any side effects or ripple effects across the codebase

### 6. Why this change may have been needed

Infer the likely motivation. Label as inference when uncertain. Possible categories:

- Bug fix
- New feature
- Cleanup/refactor
- Performance improvement
- Maintainability improvement
- Compatibility update
- Security improvement
- Docs clarification
- Removal of dead code
- Architecture alignment

### 7. Was it useful?

Evaluate the change:

- Useful / Neutral / Risky / Possibly Harmful
- Explain why
- Mention tradeoffs
- Mention whether it improves maintainability, usability, correctness, or clarity
- If it looks like a refactor only, say so
- If it introduces complexity without obvious benefit, say that too

### 8. Impact analysis

Describe:

- What users or developers would notice
- What behavior changed
- Which workflows are affected
- Whether tests or manual verification would be needed
- Whether backwards compatibility could be affected

### 9. Relationship to surrounding commits

Briefly explain how this commit fits into the sequence:

- Is it building on the previous commit?
- Is it preparing for later changes?
- Is it undoing something?
- Is it part of a larger pattern?

### 10. Confidence notes

- State how confident you are about the interpretation
- If the commit is ambiguous, note that explicitly
- Separate factual observations from inferences

### 11. Optional technical details

Add anything else helpful, such as:

- Renamed symbols
- Moved files
- Formatting-only changes
- Generated files
- Vendored files
- Binary files
- Config-only changes
- Tests added/removed
- Documentation-only commits

---

## Computing diffs

Use these commands to analyze each commit:

```bash
# For a normal commit (single parent):
git show --stat COMMIT_HASH           # File list and line counts
git diff PARENT_HASH..COMMIT_HASH     # Full diff

# For a merge commit (two parents):
git diff --stat COMMIT_HASH^1 COMMIT_HASH   # Files changed vs first parent
git diff COMMIT_HASH^1 COMMIT_HASH          # Full diff vs first parent

# For the root commit (no parent):
git diff --stat 4b825dc642cb6eb9a060e54bf899d153036d1e26 COMMIT_HASH

# To read specific file changes:
git show COMMIT_HASH -- path/to/file
```

---

## Updating the index

After documenting all new commits, update `history/index.md`:

1. Append new rows to the commit list table
2. Update summary statistics:
   - Total commits (old total + new commits)
   - Update date range if needed
   - Recalculate any stats that changed
3. Update any affected development phase entries

Use this format for new rows in the commit table:

```
| [NNNN](./NNNN_date_hash-title.md) | YYYY-MM-DD HH:MM | `abbrev7` | Your Title | One-line summary |
```

---

## Updating progress files

### `history/progress.md`

Update the status section at the top:

- Increment `Commits completed`
- Set `Commits remaining` to 0 (or appropriate)
- Update `Last completed commit` with the latest hash and info
- Set `Next commit to process` to "(none — all done)" or the next unprocessed
- Update `Last checkpoint update` timestamp
- Add new rows to the batch table if needed

### `history/progress.json`

Update these fields:

- `status`: "COMPLETE" or "IN_PROGRESS"
- `completedCommits`: new total
- `remainingCommits`: 0
- `lastCompleted.hash`: latest commit hash
- `lastCompleted.number`: latest commit number
- `lastCompleted.title`: your generated title
- `lastCheckpoint`: current timestamp
- Add new batch entries if needed
- Clear `unresolvedIssues` or add new ones

---

## Rules for analysis

- Prefer concrete evidence from the diff over guesses
- When inferring why a change happened, explicitly label it as inference
- When a commit changes only formatting or whitespace, say that clearly
- When multiple files change together, explain the relationship between them
- When the change is small, still document it carefully
- When a commit is large, prioritize clarity and structure over verbosity
- When a file is renamed or moved, document both the old and new paths
- When a file is added or deleted, explain its role in the project
- When tests change, describe whether they match the code changes
- When configuration changes, describe the downstream effect
- When dependencies change, mention likely compatibility implications
- When binary files change, document what can be observed (even if content cannot be diffed)

---

## Quality bar

Your documentation should answer these questions for every new commit:

- What changed?
- Exactly where did it change?
- How much changed?
- Why did it probably change?
- Was it beneficial?
- What does it mean for the project?

---

## Validation checklist (run after all new commits are done)

- [ ] Every new commit has exactly one Markdown file
- [ ] Index includes every commit (both old and new)
- [ ] Progress shows completion with correct totals
- [ ] Filenames are unique, ordered, and correctly formatted
- [ ] No commit was skipped
- [ ] `history/index.md` links exist and are correct
- [ ] Sequential numbering continues correctly (no gaps or overlaps)

If something cannot be determined:

- Say so clearly
- Leave a note in the commit file
- Record it in progress
- Do not silently guess

---

## Example workflow

```bash
# 1. Read current state
LAST_HASH=$(python3 -c "import json; print(json.load(open('history/progress.json'))['lastCompleted']['hash'])")
LAST_NUM=$(python3 -c "import json; print(json.load(open('history/progress.json'))['lastCompleted']['number'])")

# 2. Get new commits
git log --reverse --format="%H|%P|%an|%ad|%s" --date=format:"%Y-%m-%d %H:%M:%S" > /tmp/commits.txt

# 3. Find commits after last documented one
START=$(grep -n "$LAST_HASH" /tmp/commits.txt | head -1 | cut -d: -f1)
tail -n +$((START + 1)) /tmp/commits.txt > /tmp/new_commits.txt

# 4. For each new commit, compute diff and write file
NEXT_NUM=$((LAST_NUM + 1))
while IFS='|' read -r HASH PARENT AUTHOR DATE MSG; do
  # Compute stats
  STATS=$(git show --stat "$HASH" 2>/dev/null | tail -1)

  # Determine diff strategy
  if [ -z "$PARENT" ]; then
    DIFF_CMD="git diff 4b825dc642cb6eb9a060e54bf899d153036d1e26 $HASH"
  elif echo "$PARENT" | grep -q ' '; then
    FIRST_PARENT=$(echo "$PARENT" | cut -d' ' -f1)
    DIFF_CMD="git diff $FIRST_PARENT $HASH"
  else
    DIFF_CMD="git diff $PARENT..$HASH"
  fi

  # Generate filename
  SHORT_HASH=$(echo "$HASH" | cut -c1-7)
  DATETIME=$(echo "$DATE" | tr ':-' '-' | tr ' ' '_')
  TITLE="your-generated-title-here"  # Actually generate this from the diff content
  FILENAME=$(printf "%04d_%s_%s_%s.md" "$NEXT_NUM" "$(echo "$DATE" | tr ':-' '-' | tr ' ' '_')" "$SHORT_HASH" "$TITLE")

  # Write the file at history/$FILENAME
  # ... (generate full markdown content)

  NEXT_NUM=$((NEXT_NUM + 1))
done < /tmp/new_commits.txt

# 5. Update index and progress files
```

---

## Important working style reminders

- Do NOT use the commit message as the file title — generate your own
- Do NOT re-document already completed commits
- Do NOT collapse multiple commits into one file
- Do NOT skip commits
- Be precise, structured, and consistent with existing files
- Follow the exact same format as the existing commit files in `history/`
- When in doubt about existing format, read a few of the existing files first

---

_End of maintenance instructions. Process new commits, update files, and validate._
