# Electron Desktop App

**File:** `electron/main.cjs`

## Purpose

Desktop application wrapper for the web app:
- Runs built Vite app in Electron window
- Native desktop experience
- External link handling via shell.openExternal

## Window Configuration

| Setting | Value |
|---------|-------|
| Default Size | 1440x900 |
| Min Size | 1100x720 |
| Background | #0f172a (slate-900) |
| Menu Bar | Auto-hidden |

## Security Options

- `contextIsolation: true` - Enable context isolation
- `nodeIntegration: false` - Disable Node in renderer
- `sandbox: true` - Enable sandbox mode

## Key Functions

- `createWindow()` - Create main BrowserWindow
- `shell.openExternal(url)` - Open external links in browser

## Commands

```bash
# Build and run desktop app
npm run app
```

---

*Generated from source: electron/main.cjs*