# Server Entry Points & Workers

## 1. Main Server Entry Point

**File:** `server/server.js`

### Purpose

Express server initialization and configuration.

### Key Functions

| Function            | Description                        |
| ------------------- | ---------------------------------- |
| `createApp()`       | Create Express app with middleware |
| `startServer(port)` | Start HTTP server                  |

### Middleware Stack

- CORS
- Body parsing (JSON, URL-encoded)
- Request logging
- Static files
- API routes mount
- Error handling

### Routes Mounted

- `/api/*` - API routes
- `/admin/*` - Admin routes
- `/ws` - WebSocket

---

## 2. Llama Setup

**File:** `server/setupLlama.js`

### Purpose

Initialize Llama AI model configuration.

### Functions

- `initLlama()` - Initialize Llama
- `getLlamaConfig()` - Get config
- `loadModel(modelPath)` - Load AI model

---

## 3. Search Access Config

**File:** `server/config/searchAccessConfig.js`

### Purpose

OpenSearch access configuration and permissions.

### Config

- Index names
- Field mappings
- Access policies

---

## 4. Lead Reminders Worker

**File:** `server/workers/leadRemindersWorker.js`

### Purpose

Background worker for lead reminder scheduling.

### Functions

| Function                            | Description              |
| ----------------------------------- | ------------------------ |
| `checkReminders()`                  | Check and send reminders |
| `processReminder(reminder)`         | Process single reminder  |
| `sendNotification(userId, message)` | Send notification        |

### Schedule

- Runs every 5 minutes
- Checks `lead_reminders` table
- Sends notifications for due reminders

---

## 5. Realtime Bus (WebSocket)

**File:** `server/realtime/realtimeBus.js`

### Purpose

WebSocket connection management for real-time features.

### Functions

| Function                      | Description           |
| ----------------------------- | --------------------- |
| `addClient(ws, userId)`       | Add WebSocket client  |
| `removeClient(ws)`            | Remove client         |
| `broadcast(message)`          | Broadcast to all      |
| `sendToUser(userId, message)` | Send to specific user |

### Events

- `notification` - User notifications
- `message` - Chat messages
- `presence` - Online status

---

## 6. Dropbox Sign Provider

**File:** `server/services/providers/dropboxSign.js`

### Purpose

E-signature provider integration (Dropbox Sign).

### Functions

| Function                                      | Description         |
| --------------------------------------------- | ------------------- |
| `createSignatureRequest(templateId, signers)` | Create request      |
| `getSignatureStatus(signatureId)`             | Get status          |
| `cancelSignature(signatureId)`                | Cancel request      |
| `downloadSignedPdf(signatureId)`              | Download signed PDF |

### API

- Dropbox Sign REST API
- Webhook callbacks

---

_Generated from source: server/_
