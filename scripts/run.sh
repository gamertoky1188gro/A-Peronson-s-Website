#!/usr/bin/env bash
set -euo pipefail

DEV_OR_PREVIEW="dev"
LOCAL_RUNNING="true"
RUN_FRONTEND_BY="npm"
RUN_MODE=""
PORT_NGROK=""
PORT_NPM_DEV="5173"
PORT_NPM_PREVIEW="4173"
PORT_BACKEND="4000"
PORT_POSTGRE="5432"
PORT_OPENSEARCH="9200"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/run.sh \
    --dev-or-preview=dev|preview \
    --localrunning-or-incloud=true|false \
    --iwanttorunrunfrontendby=npm|ngrok|backend \
    --mode=ci \
    --port-ngrok=PORT \
    --port-npm-dev=PORT \
    --port-npm-preview=PORT \
    --port-backend=PORT \
    --port-postgre=PORT \
    --port-opensearch=PORT

Modes:
  dev           Start Vite dev server (default)
  preview       Build and serve via Vite preview
  backend       Build and serve dist via Express
  ngrok         Build + backend + ngrok tunnel
  ci            Run full CI pipeline: OpenSearch → reindex → lint → test → smoke
EOF
}

if [ $# -eq 0 ] && [ -n "${RUN_ARGS:-}" ]; then
  # shellcheck disable=SC2206
  set -- ${RUN_ARGS}
fi

for arg in "$@"; do
  case $arg in
    --dev-or-preview=*) DEV_OR_PREVIEW="${arg#*=}" ;;
    --localrunning-or-incloud=*) LOCAL_RUNNING="${arg#*=}" ;;
    --iwanttorunrunfrontendby=*) RUN_FRONTEND_BY="${arg#*=}" ;;
    --port-ngrok=*) PORT_NGROK="${arg#*=}" ;;
    --port-npm-dev=*) PORT_NPM_DEV="${arg#*=}" ;;
    --port-npm-preview=*) PORT_NPM_PREVIEW="${arg#*=}" ;;
    --port-backend=*) PORT_BACKEND="${arg#*=}" ;;
    --port-postgre=*) PORT_POSTGRE="${arg#*=}" ;;
    --port-opensearch=*) PORT_OPENSEARCH="${arg#*=}" ;;
    --mode=*) RUN_MODE="${arg#*=}" ;;
    --help) usage; exit 0 ;;
  esac
done

HOST_FLAG="127.0.0.1"
if [ "$LOCAL_RUNNING" = "false" ]; then
  HOST_FLAG="0.0.0.0"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  PG_USER="${POSTGRES_USER:-postgres}"
  PG_PASS="${POSTGRES_PASSWORD:-postgres}"
  PG_DB="${POSTGRES_DB:-gartexhub}"
  export DATABASE_URL="postgresql://${PG_USER}:${PG_PASS}@localhost:${PORT_POSTGRE}/${PG_DB}"
fi

echo "Mode: ${RUN_MODE:-$DEV_OR_PREVIEW}"
echo "Local: $LOCAL_RUNNING"
echo "Frontend by: $RUN_FRONTEND_BY"
echo "Ports: dev=$PORT_NPM_DEV preview=$PORT_NPM_PREVIEW backend=$PORT_BACKEND postgres=$PORT_POSTGRE opensearch=$PORT_OPENSEARCH"
echo "SKIP_BUILD: ${SKIP_BUILD:-false}"

is_skip_build() {
  case "$(printf '%s' "${SKIP_BUILD:-false}" | tr '[:upper:]' '[:lower:]')" in
    true|1|yes|y) return 0 ;;
    *) return 1 ;;
  esac
}

start_opensearch() {
  if [ -n "${OPENSEARCH_URL:-}" ]; then
    echo "Using existing OPENSEARCH_URL: $OPENSEARCH_URL"
    return
  fi
  if ! command -v docker &>/dev/null; then
    echo "Docker not available — set OPENSEARCH_URL to skip Docker"
    return
  fi
  echo "Starting OpenSearch via Docker..."
  docker compose up -d opensearch 2>/dev/null || docker-compose up -d opensearch 2>/dev/null || true
  echo "Waiting for OpenSearch on localhost:${PORT_OPENSEARCH}..."
  for i in $(seq 1 30); do
    if curl -s "http://localhost:${PORT_OPENSEARCH}" >/dev/null 2>&1; then
      echo "OpenSearch is ready"
      export OPENSEARCH_URL="http://localhost:${PORT_OPENSEARCH}"
      return
    fi
    sleep 2
  done
  echo "Warning: OpenSearch did not respond within timeout"
}

# CI mode: run the full pipeline
if [ "$RUN_MODE" = "ci" ]; then
  start_opensearch
  echo "=== CI: Reindexing sample data ==="
  npm run ci:reindex
  echo "=== CI: Running lint ==="
  npm run lint
  echo "=== CI: Running unit tests ==="
  npm test
  echo "=== CI: Running smoke tests ==="
  npm run ci:smoke
  echo "=== CI: All checks passed ==="
  exit 0
fi

# Auto-start OpenSearch for dev/preview/backend modes
start_opensearch

if [ "$DEV_OR_PREVIEW" = "dev" ]; then
  if [ "$RUN_FRONTEND_BY" != "npm" ]; then
    echo "Dev mode only supports --iwanttorunrunfrontendby=npm (backend/ngrok disabled)."
    exit 1
  fi
  echo "Starting Vite dev server..."
  npm run dev -- --host "$HOST_FLAG" --port "$PORT_NPM_DEV"
  exit 0
fi

if [ "$DEV_OR_PREVIEW" != "preview" ]; then
  echo "Unknown --dev-or-preview value: $DEV_OR_PREVIEW"
  usage
  exit 1
fi

if [ "$RUN_FRONTEND_BY" = "npm" ]; then
  echo "Starting Vite preview..."
  npm run preview -- --host "$HOST_FLAG" --port "$PORT_NPM_PREVIEW"
  exit 0
fi

export PORT="$PORT_BACKEND"

if [ "$RUN_FRONTEND_BY" = "backend" ]; then
  if ! is_skip_build; then
    echo "Building frontend and serving dist via backend..."
    npm run build
  fi
  export SERVE_DIST="true"
  export NODE_ENV="production"
  echo "Starting backend server..."
  node server/server.js
  exit 0
fi

if [ "$RUN_FRONTEND_BY" = "ngrok" ]; then
  if ! is_skip_build; then
    echo "Building frontend and serving dist via backend..."
    npm run build
  fi
  export SERVE_DIST="true"
  export NODE_ENV="production"
  echo "Starting backend server..."
  node server/server.js &
  BACKEND_PID=$!
  TUNNEL_PORT="${PORT_NGROK:-$PORT_BACKEND}"
  echo "Starting ngrok tunnel for port $TUNNEL_PORT..."
  ngrok http "$TUNNEL_PORT"
  echo "Stopping backend..."
  kill "$BACKEND_PID" || true
  exit 0
fi

echo "Unknown --iwanttorunrunfrontendby value: $RUN_FRONTEND_BY"
usage
exit 1
