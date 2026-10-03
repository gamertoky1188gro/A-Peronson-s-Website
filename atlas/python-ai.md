# python-ai

- **Purpose**: HaramDetection — standalone Python AI image-detection tool bundled in-repo (not wired into the marketplace runtime).
- **Key Files**: `PythonAi/HaramDetection/main.py`, `PythonAi/HaramDetection/config.yaml`, `PythonAi/HaramDetection/haram.ps1`, `PythonAi/HaramDetection/README.md`
- **Dependencies**: (none — isolated; vendored Windows DLLs under `pyd/`)
- **Dependents**: (none)
- **Exposes**: CLI/GUI detection runs via `haram.ps1`; no imports from `src/` or `server/`.
