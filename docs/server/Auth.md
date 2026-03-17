# Auth

This doc is generated from source snapshots with `path:line` references.

## Mounted prefixes

- `/api/auth` -> `server/routes/authRoutes.js:59` (router var: `authRoutes`)

## Routes (ultra-detailed)

### POST `/api/auth/register`

- **Route definition:** `server/routes/authRoutes.js:7`

```js
router.post('/register', register)
```
- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `register`
- **Controller file:** `server/controllers/authController.js`

#### Controller implementation: `server/controllers/authController.js:5`

```js
export async function register(req, res) {
  const missing = requireFields(req.body, ['name', 'email', 'password', 'role'])
  if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
  if (!validateEmail(req.body.email)) return res.status(400).json({ error: 'Invalid email' })
  if (!validateRole(req.body.role)) return res.status(400).json({ error: 'Invalid role' })

  const existing = await findUserByEmail(req.body.email)
  if (existing) return res.status(409).json({ error: 'Email already used' })

  const user = await registerUser(req.body)
  const token = signToken(user)
  return res.status(201).json({ user, token })
}

```
### POST `/api/auth/login`

- **Route definition:** `server/routes/authRoutes.js:8`

```js
router.post('/login', login)
```
- **Middleware stack (in order):**
  - _none detected_
- **Handler:** `login`
- **Controller file:** `server/controllers/authController.js`

#### Controller implementation: `server/controllers/authController.js:19`

```js
export async function login(req, res) {
  const missing = requireFields(req.body, ['email', 'password'])
  if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })

  const user = await findUserByEmail(req.body.email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await verifyPassword(user, req.body.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const { password_hash: _passwordHash, ...safeUser } = user
  const token = signToken(safeUser)
  return res.json({ user: safeUser, token })
}


```
### GET `/api/auth/me`

- **Route definition:** `server/routes/authRoutes.js:9`

```js
router.get('/me', requireAuth, me)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `me`
- **Controller file:** `server/controllers/authController.js`

#### Controller implementation: `server/controllers/authController.js:35`

```js
export async function me(req, res) {
  const user = await findUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const { password_hash: _passwordHash, ...safeUser } = user
  return res.json({ user: safeUser })
}

```
### POST `/api/auth/logout`

- **Route definition:** `server/routes/authRoutes.js:10`

```js
router.post('/logout', requireAuth, logout)
```
- **Middleware stack (in order):**
  - `requireAuth`
- **Handler:** `logout`
- **Controller file:** `server/controllers/authController.js`

#### Controller implementation: `server/controllers/authController.js:43`

```js
export async function logout(req, res) {
  return res.json({ ok: true, message: 'Logout handled on client by dropping JWT' })
}

```
## Persistence model (JSON-backed "DB")

- JSON helpers: `server/utils/jsonStore.js` (readJson/writeJson/updateJson).
- Data files: `server/database/*.json`.
- Controllers/services often read from `users.json`, `messages.json`, `metrics.json`, etc.

