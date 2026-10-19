# Rollout note - upload access control (2026-10-18)

Branch: `feat/upload-access-control`. Migration-free: no Prisma schema change and no
migration. This note is the operational half of the change - what a user sees on day
one, and what is still locked.

## The new model

Every private upload lives under one of four gated prefixes (`chat/`, `contracts/`,
`calls/`, `search/`). Those bytes are no longer served by the static mount at all: the
mount 404s the four prefixes, and the only way to read one is a short-lived signed URL
minted by `POST /api/files/sign` after the server has authorized the requester.

Authorization keys on a `Document` row. **A file with no row is not public - it is
unreachable, for everyone, including the person who uploaded it.** That is the
fail-closed direction, and it is why the rows are written at upload time.

## What changes for a user

| Area | Before | After |
|---|---|---|
| Chat attachment | readable by anyone with the URL | readable by the thread participants (and the uploader) |
| Call recording | readable by anyone with the URL | readable by the participants of the owning call session |
| Search image (visual search upload) | readable by anyone with the URL | readable by the uploader |
| Contract PDF | readable by anyone with the URL | readable by the two named parties, the creator of a blank-party draft, and admins |
| Public media (`feed/`, `profile/`, root-level CMS assets) | public | unchanged - still public |

Old unsigned URLs for the four gated prefixes stop working immediately. That is the
vulnerability being closed, not a regression.

## What is still locked, and why (I2)

The production database was read during the final review. It holds **208 contract rows,
all of them orphans**:

- `uploaded_by: "system"`, `contract_number: null`, `artifact: null`
- no `buyer_id`, no `factory_id`

There is no party to derive from a file name, so under fail-closed every one of them is
denied to every non-admin and readable only by an admin. **ContractVault is therefore
empty for every real user on day one.** This is the intended outcome of the change, not
a defect, and the spec accepted it - but it is a rollout fact, and it needs to be
communicated rather than discovered.

The admin uploads listing flags these files as unclaimed private files
(`uploadsService.flagUnclaimedPrivateFiles`), so an operator can see them. There is no
claim path yet: adopting one of them means deciding who the parties were, and that is a
product decision, not an authorization change. Until it exists, the honest options for a
user who needs a specific contract are:

1. re-upload the PDF through the contract flow (it gets a real contract row), or
2. ask an admin to attach it to the right contract.

### The other orphans, for completeness

- **Chat files that predate the write-time registry** (three on disk at review time:
  `1773450152511-example.txt`, `1773453895424-sample1.html`, `1773455031098-ARRAY.c`).
  The registry pass now creates a `system` row for every file on disk, and chat
  authorization is message-based - a participant of the thread the file was posted in
  can read it. The uploader can read it too. So these are reachable by the right people
  again.
- **Call recordings adopted from disk.** A recording adopted by the registry pass has
  no owning call id (the call id only exists at upload time, and `recording_url` is
  caller-supplied, so it cannot be trusted to recover it). Such a row authorizes an
  admin only. There are none today - `server/uploads/calls/` was empty at review time -
  and every recording uploaded from now on carries its owning call id.
- **Search images adopted from disk.** A `system` row authorizes an admin only; every
  new upload carries the real uploader.

## Deploy steps

1. `UPLOADS_SIGNING_SECRET` must be set. It is now in `REQUIRED_ENV_VARS`, so the
   server **exits at boot** without it, and it is declared in `render.yaml` with
   `generateValue: true`. It must be at least 32 characters. This is the one step that
   can break a deploy, and it breaks loudly rather than silently.
2. No migration. No backfill job. The registry pass that creates missing `Document`
   rows runs once at boot, is independent of `AI_HARAM_ANALYTICS_ENABLED`, and is
   idempotent (it matches on the file name and creates a row only where one is
   missing).
3. Tell users that contract PDFs uploaded before the change are not visible to them
   yet, and that re-uploading (or asking an admin) is the way through.

## What was deliberately NOT changed

- `AI_HARAM_ANALYTICS_ENABLED=false` stays off. The registry pass was split out of the
  moderation scanner precisely so that row creation no longer depends on it.
- The 208 orphan files are not moved, rewritten or re-attributed.
- `POST /api/documents/url` is now owner/admin only. See the spec and the plan; it is
  an API change, recorded in both.
