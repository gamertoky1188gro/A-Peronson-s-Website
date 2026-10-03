# backend-workers

- **Purpose**: Background jobs — SLA reminders and join-request nudges.
- **Key Files**: `server/workers/leadRemindersWorker.js`, `server/workers/joinRequestReminderWorker.js`, `server/services/leadReminderService.js`, `server/services/leadSlaTimer.js` (in services), `server/services/imageQueue.js`, `server/services/videoQueue.js`, `server/services/esignRetryService.js`
- **Dependencies**: backend-services, backend-utils
- **Dependents**: backend-server (boot + `markWorker` tracking)
- **Exposes**: Periodic overdue-lead escalation, join-request reminders, media processing queues, e-sign retry; depths reported to logHub via `setRuntimeMetrics({workers, workQ})`.
