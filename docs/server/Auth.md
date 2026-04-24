# Auth

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/auth` -> `server/routes/authRoutes.js:111` (router var: `authRoutes`)

## Routes (ultra-detailed)

### POST `/api/auth/register`

- **Route definition:** `server/routes/authRoutes.js:18`

```js
router.post("/register", register);
```

- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `register`
- **Controller file:** `—`

### POST `/api/auth/login`

- **Route definition:** `server/routes/authRoutes.js:19`

```js
router.post("/login", login);
```

- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `login`
- **Controller file:** `—`

### POST `/api/auth/passkey/login/options`

- **Route definition:** `server/routes/authRoutes.js:20`

```js
router.post("/passkey/login/options", passkeyLoginOptions);
```

- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `passkeyLoginOptions`
- **Controller file:** `—`

### POST `/api/auth/passkey/login/verify`

- **Route definition:** `server/routes/authRoutes.js:21`

```js
router.post("/passkey/login/verify", passkeyLoginVerify);
```

- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `passkeyLoginVerify`
- **Controller file:** `—`

### POST `/api/auth/passkey/registration/options`

- **Route definition:** `server/routes/authRoutes.js:22`

```js
router.post(
  "/passkey/registration/options",
  requireAuth,
  passkeyRegistrationOptions,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `passkeyRegistrationOptions`
- **Controller file:** `—`

### POST `/api/auth/passkey/registration/verify`

- **Route definition:** `server/routes/authRoutes.js:23`

```js
router.post(
  "/passkey/registration/verify",
  requireAuth,
  passkeyRegistrationVerify,
);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `passkeyRegistrationVerify`
- **Controller file:** `—`

### GET `/api/auth/passkeys`

- **Route definition:** `server/routes/authRoutes.js:24`

```js
router.get("/passkeys", requireAuth, passkeyList);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `passkeyList`
- **Controller file:** `—`

### DELETE `/api/auth/passkeys/:credentialId`

- **Route definition:** `server/routes/authRoutes.js:25`

```js
router.delete("/passkeys/:credentialId", requireAuth, passkeyRemove);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `passkeyRemove`
- **Controller file:** `—`

### GET `/api/auth/me`

- **Route definition:** `server/routes/authRoutes.js:26`

```js
router.get("/me", requireAuth, me);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `me`
- **Controller file:** `—`

### POST `/api/auth/logout`

- **Route definition:** `server/routes/authRoutes.js:27`

```js
router.post("/logout", requireAuth, logout);
```

- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `logout`
- **Controller file:** `—`

## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.
