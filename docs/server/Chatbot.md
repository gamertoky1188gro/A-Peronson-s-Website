# Chatbot / AI Assistant

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/chatbot` -> `server/routes/chatbotRoutes.js:10` (router var: `router`)

## Routes (ultra-detailed)

### GET `/api/chatbot/profile/:userId`

- **Route definition:** `server/routes/chatbotRoutes.js:13`

```js
router.get("/profile/:userId", requireAuth, getChatbotProfile);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getChatbotProfile`
- **Controller file:** `server/controllers/chatbotController.js`
- **Note:** Public summary for UI but requires auth (reveals product hints)

---

### POST `/api/chatbot/reply`

- **Route definition:** `server/routes/chatbotRoutes.js:16`

```js
router.post("/reply", requireAuth, replyWithChatbot);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `replyWithChatbot`
- **Controller file:** `server/controllers/chatbotController.js`
- **Purpose:** Generate AI bot reply for a chat thread

---

### GET `/api/chatbot/settings`

- **Route definition:** `server/routes/chatbotRoutes.js:17`

```js
router.get("/settings", requireAuth, getChatbotSettingsController);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `getChatbotSettingsController`
- **Controller file:** `server/controllers/chatbotController.js`

---

### POST `/api/chatbot/settings`

- **Route definition:** `server/routes/chatbotRoutes.js:18`

```js
router.post("/settings", requireAuth, updateChatbotSettingsController);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `updateChatbotSettingsController`
- **Controller file:** `server/controllers/chatbotController.js`

---

## Service Layer

- **Chatbot Service:** `server/services/chatbotService.js`
- **AI Service:** `server/services/aiService.js` (for reply generation)

## Related Features

- AI auto-reply in chat threads
- Knowledge base integration
- Bot profile customization

---

_Generated from source: server/routes/chatbotRoutes.js_
