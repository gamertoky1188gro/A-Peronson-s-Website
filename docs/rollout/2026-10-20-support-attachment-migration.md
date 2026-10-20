# Rollout note — support attachment migration (2026-10-20)

Branch: `feat/ws1-case-api`. Migration-free on the database side: no Prisma schema
change and no migration. This note is the operational half of the change — what has to
happen, in what order, and how to tell that it worked.

## What changed

A support case's evidence (the client's screenshots, logs and exports) used to be
written into the **root** of `server/uploads`. The static mount serves that root
unauthenticated, so a client's support screenshot was world-readable to anyone who
guessed or was given the file name.

Three things close that:

1. **`/uploads/support/` is a gated prefix.** The bytes land there now, and the static
   mount 404s the prefix. The only way to read a file is a short-lived signed URL minted
   by `POST /api/files/sign` after the server has authorized the requester.
2. **The `support_case` resolver branch is namespace-restricted.** A `support_case` row
   only authorizes bytes under `/uploads/support/`, exactly like the `search_image`
   branch does for `/uploads/search/`. A row of that type can no longer be pointed at
   another namespace's bytes.
3. **The upload checks that the caller owns the case.** `entity_id` is resolved against
   a `SupportCase` (or, for the legacy client, a `SupportTicket`); the caller has to own
   it, and an id that names nothing is refused with a 400.

## The order, and why the intuitive order is wrong

The intuitive order is "move the files first, then deploy the code". **That order is
wrong**, and it is wrong in a way that leaves the exposure open for longer, not
shorter.

**Step 1 — Deploy the code.** The `support` prefix becomes gated and the resolver
branch goes live. From this moment on, new uploads land in the gated namespace and
carry a `Document` row that names their uploader.

**Step 2 — Run the migration script on the host that actually holds the served
files.** `scripts/db/migrate-support-attachments.mjs` resolves its paths from
`process.cwd()`: it looks for `server/uploads` **relative to the working directory of
the process that runs it**. It therefore has to run on the machine whose disk is
served — the Render instance, the container, the host — and not on a laptop.

> Run it from a laptop against a production database and it reports every row
> `unmovable`, moves nothing, and raises no error. The exit code is 0. It looks
> exactly like a successful no-op, and the exposure is still open. **This is the
> single most likely way for this rollout to be believed done and not be done.**

**Step 3 — The exposure closes here, and only here.** Until the script has actually
run, the legacy screenshots are still sitting in the uploads **root**, and the root is
never gated — CMS assets live there (`/uploads/logo.png` and friends are public and
unlisted by design). So the legacy files keep being served unauthenticated at
`/uploads/<name>` until they are physically moved. Their names are
`${Date.now()}-<basename>`: guessable from the upload time and the original file name,
and permanent, because nothing expires them.

Steps 1 and 2 in the other order would mean: the script runs first, while the old
resolver still treats a `support_ticket` row as a hard deny and the `support` prefix
is still unguarded. Moving the bytes before the prefix is gated does not close the
hole — the bytes are in a new directory that the static mount still serves in the
clear. The code has to be live before the move, so that the directory the bytes move
*into* is already closed.

## Running the script

```
node scripts/db/migrate-support-attachments.mjs --dry-run     # print the plan, change nothing
node scripts/db/migrate-support-attachments.mjs               # apply the plan
```

`npm run db:migrate:support-attachments` is the same thing without the flag.

**`--dry-run` touches neither the filesystem nor the database.** It moves no file,
retypes no row and deletes nothing; it does not even create the target directory. It
reads the support rows and stats the files, which is the only way to know what the
real run would do. Run it first, read the plan, then run it for real.

### Expected output

```
support attachment migration (DRY RUN): 214 support row(s) examined
  would move : 187
    server/uploads/1773450152511-example.txt -> /uploads/support/1773450152511-example.txt (row 3f9c…)
  would retype : 27
    /uploads/support/1773453900000-shot.png (row 71b2…: support_ticket -> support_case)
  skipped : 0 (already in /uploads/support/)
  UNMOVABLE: 0 (left in place, NOT deleted)

  DRY RUN: nothing was moved, retyped or deleted, and no file was written.
  Re-run without --dry-run to apply this plan.
```

The real run prints the same shape with `moved` and `retyped` instead of `would move`
and `would retype`, and no DRY RUN footer.

`UNMOVABLE` rows are **left exactly where they are and are never deleted**. The script
refuses to move a file that is not directly in the uploads root (another row may
anchor those bytes) and refuses to overwrite a name that is taken. Move those by hand
into `server/uploads/support/` and re-run.

### How to verify

The legacy file name is now 404 on the static mount:

```
curl -i https://<your-host>/uploads/1773450152511-example.txt
HTTP/2 404
```

Before the migration it answered `200` with the file's bytes to anybody who asked.
After it, the same URL is a 404, and the bytes are reachable only through a signed
URL that the server hands to a caller it has authorized.

The same file also stops resolving through the authorization resolver before the
script has run: the `support_case` branch now requires the row's `file_path` to start
with `/uploads/support/`, so a legacy row is denied to everybody (administrators
included, via the resolver) until the row is re-pointed. **That is the intended
direction** — fail closed — but it does mean the two steps have to happen in this
order or the evidence is unreadable in between.

## The risk nobody can verify from here

**If the Render instance's `server/uploads` is an ephemeral disk, relocating the
legacy bytes is pointless, and the exposure has to be closed by deleting them
instead.**

The script's whole value is that it moves the bytes out of the public root. On an
ephemeral disk those bytes are already gone after the next deploy — the files were
never durable in the first place, so "moving" them is a no-op with a report attached
to it. In that world:

- the legacy screenshots are **not** still exposed after the next deploy; they are
  gone, and so is the evidence;
- the exposure that mattered was the window **between** the deploy that introduced
  the support namespace and the next deploy — during which the old root files were
  live and public;
- closing it means **deleting** the legacy files from the uploads root (not moving
  them), not relocating them.

**Which of the two worlds you are in cannot be determined from the repository.** It
depends on whether the Render service has a persistent disk mounted at
`server/uploads`. Check the Render service's disk configuration directly. If it does
have a persistent disk, use the script as written. If it does not, delete the legacy
files instead — and accept that the evidence attached to old tickets is gone.

Either way, the check that settles it is the same: after the deploy, ask for a legacy
file name and see whether it answers `200` or `404`.

## What was deliberately NOT changed

- The uploads **root** is still public and unlisted. CMS assets live there.
- The 208 orphan contract PDFs are untouched by this script: it only looks at rows
  whose `entity_type` is `support_ticket` or `support_case`.
- The legacy client (`FeedbackPage.jsx`, `SupportReports.jsx`) still works. It sends a
  **ticket** id, and the upload path resolves a `SupportTicket` as well as a
  `SupportCase`, so the legacy attachment flow is not broken by the ownership check.
