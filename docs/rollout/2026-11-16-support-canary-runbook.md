# Support portal — Phase E canary runbook

**What this is:** the exact procedure for the one real, end-to-end support
investigation that turns the portal from "built and proven in parts" into
"proven as a whole". It is deliberately manual: the canary is meant to be
watched by a human, and its result is written down at the end.

**Who runs it:** the owner (it needs a real complaint and a real inbox).

**When:** after the deployment of the current `main` is live on Render.

**How long:** 20–40 minutes, most of it waiting for the investigation to
finish. The free models answer in minutes, not seconds.

---

## 0. Preconditions

| # | Check | How | Expected |
|---|-------|-----|----------|
| 0.1 | `main` is deployed | Render dashboard → the web service | the deploy is green and the commit is the one in the rollout note |
| 0.2 | The read-only proof is on file | `docs/rollout/2026-11-16-investigation-readonly-proof.md` | the live spike passed 8/8, twice |
| 0.3 | The mail path is proven | `docs/rollout/2026-11-15-support-two-mode-migration.md` → Phase 8 appendix | one canary mail was accepted by Gmail (`status: sent`) |
| 0.4 | An owner account exists | `/admin` → sign in | the console loads and the **AI Support** tab is reachable |
| 0.5 | The investigation models are set | `/admin` → **AI Support** → **Investigation Models** | at least one model is allowed and the default is one of them |
| 0.6 | The queue has room | the same tab → **Auto-routing rules** / model list | nothing to configure here — the queue limit is `INVESTIGATION_QUEUE_MAX_DEPTH` (default 20) |

---

## 1. Turn the mail on (and remember to turn it off)

The report mail is **off** by default (`notifications.email.enabled = false`).
Turn it on for the canary and off again afterwards.

1. `/admin` → **Settings** (or the config editor) → **Notifications** → set
   **email.enabled = true**.
2. Confirm the sender is set: `notifications.email.from_email` must be the
   Gmail account that owns the app password, and `GMAIL_USER` /
   `GMAIL_APP_PASSWORD` must be live in the Render environment.
3. Send a **test email** to yourself from the same panel. The panel must say
   the mail was **delivered** — not "logged" and not "disabled". If it says
   anything else, stop here and fix the transport before continuing.

> **Rollback:** set `email.enabled = false` again. Nothing else has to be
> undone, and the investigations themselves are unaffected — escalation and
> the owner console work with the mail off.

---

## 2. Issue the buyer token

1. `/admin` → **AI Support** → **Support Tokens**.
2. Search for the account that will file the complaint (any role works — a
   buyer, a member, an owner; the token is not role-gated).
3. Give it a label you will recognise later ("canary 2026-11-16").
4. Set an expiry — **30 days** is a good default for a canary, so a forgotten
   token dies on its own.
5. **Issue token.** The token is shown **once**. Copy it now.

---

## 3. File the complaint

Use a complaint you actually care about. The investigation reads the
repository, so a real problem is worth the run.

1. Open `/support` in a **private window** (so the browser session is not the
   owner's admin session).
2. Choose the **AI support chat** mode, paste the token, and continue.
3. Describe the problem in the client's own words. Include what you expected,
   what happened, and how to reproduce it. Attach a screenshot if you have
   one — the evidence reaches the investigators.
4. Answer the clarifying questions. They are there to make the investigation
   answerable; "I don't know, but here's what I do know" is a valid answer
   and is better than a guess.
5. When the case is ready, tick **"I've reviewed this report and I'm ready to
   send it"** and confirm.

**What to watch:** the case moves `collecting → investigating → reporting →
completed`. The progress rail in the buyer view shows the stage.

---

## 4. Watch the investigation

The owner console shows the same case:

- `/admin?case=<case-id>` — the deep link in the report mail opens the case
  directly. (The case id is in the browser URL of the buyer's report view.)
- **Overview** — the client, the stage rail, the summary, and the buyer's
  feedback once they leave one.
- **Conversation** — the whole transcript, the buyer's words on the right.
- **Evidence** — the attachments, with signed URLs.
- **Code findings** — the findings per role, with their confidence.
- **Activity** — one group per investigation run: role, model, status,
  attempt, start → end, and that run's tool calls in order.
- **Email report** — the report as it was mailed, the delivery status, the
  **Print / Save as PDF** and **Download HTML** export, and **Resend report**.

---

## 5. Verify the delivery

1. The buyer's mailbox should contain one mail with the subject
   `[GarTexHub Support] Investigation report: <subject>` and a link back to
   the case.
2. The **Email report** tab in the console must show **Sent** (or **Delivered**
   with a timestamp), never "logged".
3. If the mail did **not** arrive, the console still shows the report and the
   **Resend report** button re-sends it. A mail failure does not undo the
   investigation.

---

## 6. Record the result

Write the outcome at the bottom of this file and in
`docs/rollout/2026-11-15-support-two-mode-migration.md`:

```
Canary date:
Case id:
Complaint (one line):
Models used (per role):
Investigation wall clock:
Report mail: sent / failed (status: …)
Escalation fired: yes / no (why)
Buyer feedback: up / down / none (note)
Owner console: everything rendered / what did not
Rollback used: yes / no
Open issues:
```

Then tick **E.4** in `docs/plans/2026-11-16-support-portal-todos.md` and
fill in **E.5** (enable date, canary result, known limits).

---

## 7. Turn the mail off again

Unless the owner decides investigations are live for everyone (and says so
explicitly), set `notifications.email.enabled = false` and leave the
investigation tokens alone: investigations only run for accounts that hold a
token, so an unused token is a dormant case.

---

## What a failure looks like, and where to look

| Symptom | Where to look |
|---------|---------------|
| The case never leaves `collecting` | the case service wants more client answers — the clarification round cap is 6 |
| The investigation failed on every model | **AI Support → Investigation Models → model health**: quota refusals are counted per model; the free tier's limit is per model |
| The report is empty or says INCOMPLETE | a failed run is reported as a limitation — that is the honest path, not a bug |
| The mail says "logged" instead of "sent" | the transport is disabled or has no credentials: step 1 |
| No escalation on a data-loss finding | the classifier is in `server/services/investigation/delivery.js`; the escalation never reads the mail result |
| The runtime cannot start | `OPENCODE_BIN` / `OPENCODE_INVESTIGATION_PASSWORD` in the Render environment |
