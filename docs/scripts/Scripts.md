# Scripts Documentation

**Location:** `scripts/`

## Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `run.sh` | Dev/preview server launcher | ✅ |

---

## run.sh

**File:** `scripts/run.sh`

### Purpose
Startup script for development/preview modes with configurable ports

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--dev-or-preview` | `dev` | Mode: `dev` or `preview` |
| `--localrunning-or-incloud` | `true` | Local or cloud deployment |
| `--iwanttorunrunfrontendby` | `npm` | Frontend runner: `npm`, `backend`, or `ngrok` |
| `--port-ngrok` | (empty) | ngrok tunnel port |
| `--port-npm-dev` | `5173` | Vite dev server port |
| `--port-npm-preview` | `4173` | Vite preview port |
| `--port-backend` | `4000` | Backend server port |
| `--port-postgre` | `5432` | PostgreSQL port |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (auto-generated) | PostgreSQL connection |
| `POSTGRES_USER` | `postgres` | PG username |
| `POSTGRES_PASSWORD` | `postgres` | PG password |
| `POSTGRES_DB` | `gartexhub` | PG database |
| `SKIP_BUILD` | `false` | Skip frontend build |
| `RUN_ARGS` | (empty) | Pass args via env |

### Modes

1. **Dev Mode** - `npm run dev` on port 5173
2. **Preview (npm)** - `npm run preview` on port 4173
3. **Preview (backend)** - Build + serve via Express on port 4000
4. **Preview (ngrok)** - Build + backend + ngrok tunnel

### Usage Examples

```bash
# Dev mode (default)
./scripts/run.sh

# Preview with backend
./scripts/run.sh --dev-or-preview=preview --iwanttorunrunfrontendby=backend

# Preview with ngrok
./scripts/run.sh --dev-or-preview=preview --iwanttorunrunfrontendby=ngrok --port-ngrok=4040

# Custom ports
./scripts/run.sh --port-backend=5000 --port-npm-dev=3000
```

---

*Generated from: scripts/*