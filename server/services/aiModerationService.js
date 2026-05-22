import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";

const HARAM_DETECTION_DIR = process.env.HARAM_DETECTION_DIR;
const aiAvailable = Boolean(HARAM_DETECTION_DIR);

if (!aiAvailable) {
  console.warn("[AI Moderation] HARAM_DETECTION_DIR not set — AI moderation disabled");
}

export function isAIAnalyticsEnabled() {
  const val = process.env.AI_HARAM_ANALYTICS_ENABLED;
  if (val === undefined || val === null) return true;
  return val === "true" || val === "1";
}
const VENV_DIR = path.join(HARAM_DETECTION_DIR, ".venv");
const VENV_PY_WIN = path.join(VENV_DIR, "Scripts", "python.exe");
const VENV_PY_LIN = path.join(VENV_DIR, "bin", "python");
const VENV_UV =
  path.join(VENV_DIR, "Scripts", "uv.exe") || path.join(VENV_DIR, "bin", "uv");

function getVenvPython() {
  if (process.platform === "win32" && fs.existsSync(VENV_PY_WIN))
    return VENV_PY_WIN;
  if (fs.existsSync(VENV_PY_LIN)) return VENV_PY_LIN;
  return null;
}

function getVenvUv() {
  if (process.platform === "win32" && fs.existsSync(VENV_UV)) return VENV_UV;
  return "uv";
}

async function runSync(
  command,
  args,
  cwd = HARAM_DETECTION_DIR,
  timeoutMs = 300000,
) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { cwd, windowsHide: true });
    let stdout = "";
    let stderr = "";
    proc.stdout?.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    const timer = setTimeout(() => {
      try {
        proc.kill();
      } catch {
        /* ignore */
      }
      reject(new Error("timeout"));
    }, timeoutMs);
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `exit code ${code}`));
    });
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export async function ensureVenv() {
  if (!aiAvailable) return;
  if (!isAIAnalyticsEnabled()) return;
  const pyExe = getVenvPython();
  if (pyExe) {
    try {
      await runSync(
        pyExe,
        ["-c", "import numpy; import torch"],
        HARAM_DETECTION_DIR,
        30000,
      );
      console.log("[AI Moderation] venv Python ready with all packages");
      return;
    } catch (_) {
      console.log(
        "[AI Moderation] venv exists but packages missing, installing...",
      );
    }
  }

  if (!fs.existsSync(VENV_DIR)) {
    console.log("[AI Moderation] Creating venv with Python 3.11...");
    try {
      await runSync(
        "uv",
        ["venv", "--python", "3.11", VENV_DIR],
        HARAM_DETECTION_DIR,
      );
      console.log("[AI Moderation] venv created");
    } catch (err) {
      console.error("[AI Moderation] venv creation failed:", err.message);
      return;
    }
  }

  console.log("[AI Moderation] Running uv sync...");
  try {
    await runSync("uv", ["sync"], HARAM_DETECTION_DIR, 600000);
  } catch (err) {
    console.warn("[AI Moderation] uv sync warning:", err.message);
  }

  const venvPy = getVenvPython();
  if (venvPy) {
    console.log("[AI Moderation] Installing torch CPU...");
    try {
      await runSync(
        getVenvUv(),
        [
          "pip",
          "install",
          "torch",
          "torchvision",
          "--index-url",
          "https://download.pytorch.org/whl/cpu",
        ],
        HARAM_DETECTION_DIR,
        600000,
      );
    } catch (err) {
      console.warn("[AI Moderation] torch install warning:", err.message);
    }
  }

  console.log("[AI Moderation] venv setup complete");
}

function buildPythonScript(filePath) {
  const safeDir = JSON.stringify(HARAM_DETECTION_DIR);
  const safePath = JSON.stringify(filePath);
  return `import sys\nimport json\nimport os\nsys.path.insert(0, ${safeDir})\nos.environ['PYTHONWARNINGS']='ignore'\nos.environ['KMP_DUPLICATE_LIB_OK']='TRUE'\nimport warnings;warnings.filterwarnings('ignore')\nfrom src.api import create_api\napi=create_api()\nresult=api.check_file(${safePath})\nprint(json.dumps(result))`;
}

function runPython(script) {
  const py = getVenvPython() || "python3";
  return new Promise((resolve, reject) => {
    const proc = spawn(py, ["-c", script], {
      cwd: HARAM_DETECTION_DIR,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    proc.stdout?.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    const timer = setTimeout(() => {
      try {
        proc.kill();
      } catch {
        /* ignore - process may already be gone */
      }
      reject(new Error("timeout"));
    }, 300000);
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch {
          reject(new Error("parse error"));
        }
      } else {
        reject(new Error(stderr || `exit ${code}`));
      }
    });
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export async function analyzeImageWithAI(filePath) {
  if (!aiAvailable) {
    throw new Error("AI moderation unavailable (HARAM_DETECTION_DIR not set)");
  }
  if (!isAIAnalyticsEnabled()) {
    throw new Error(
      "AI Haram Analytics is disabled via AI_HARAM_ANALYTICS_ENABLED",
    );
  }
  await ensureVenv();
  return runPython(buildPythonScript(filePath));
}

export async function analyzeBufferWithAI(buffer, filename = "image.jpg") {
  if (!aiAvailable) {
    throw new Error("AI moderation unavailable (HARAM_DETECTION_DIR not set)");
  }
  if (!isAIAnalyticsEnabled()) {
    throw new Error(
      "AI Haram Analytics is disabled via AI_HARAM_ANALYTICS_ENABLED",
    );
  }
  await ensureVenv();
  const tempDir = os.tmpdir();
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const tempFile = path.join(tempDir, `haram_${crypto.randomUUID()}_${safeFilename}`);

  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(tempFile, buffer);
    } catch (err) {
      return reject(err);
    }

    const cleanup = () => {
      try {
        fs.unlinkSync(tempFile);
      } catch {
        /* ignore if already gone */
      }
    };

    runPython(buildPythonScript(tempFile))
      .then((result) => {
        cleanup();
        resolve(result);
      })
      .catch((err) => {
        cleanup();
        reject(err);
      });
  });
}
