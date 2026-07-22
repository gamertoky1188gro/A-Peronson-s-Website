import prisma from "./prisma.js";
import chalk from "chalk";
import { logInfo, logWarn } from "../utils/logger.js";

let dbConnected = false;
let dbError = "";

export function getDbStatus() {
  return {
    connected: dbConnected,
    error: dbError,
  };
}

export async function ensureDatabaseConnection() {
  const allowOffline = ["1", "true", "yes"].includes(
    String(process.env.ALLOW_DB_OFFLINE || "").toLowerCase(),
  );
  if (!process.env.DATABASE_URL) {
    if (allowOffline) {
      dbConnected = false;
      dbError = "DATABASE_URL missing (offline mode allowed)";
      console.warn(
        chalk.yellow("[db] DATABASE_URL missing; continuing in offline mode."),
      );
      return;
    }
    dbConnected = false;
    dbError = "DATABASE_URL is required to start the server (PostgreSQL)";
    throw new Error(dbError);
  }
  try {
    const safeUrl = new URL(process.env.DATABASE_URL);
    const maskedPass = safeUrl.password ? "***" : "";
    const safe = `${safeUrl.protocol}//${safeUrl.username}${maskedPass ? `:${maskedPass}` : ""}@${safeUrl.host}${safeUrl.pathname}`;
    logInfo("db Using DATABASE_URL", { url: safe });
  } catch {
    logInfo("db Using DATABASE_URL (unparsed)", { url: "[redacted]" });
  }
  while (true) {
    try {
      await prisma.$connect();
      dbConnected = true;
      dbError = "";
      break;
    } catch (error) {
      dbConnected = false;
      dbError = error?.message || "DB connection failed";
      if (allowOffline) {
        console.warn(
          chalk.yellow("[db] Failed to connect; continuing in offline mode:"),
          dbError,
        );
        return;
      }
      console.warn(
        chalk.yellow(`[db] Connection failed: ${dbError}. Retrying in 30s...`),
      );
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }
}

export function startDbHeartbeat() {
  const HEARTBEAT_INTERVAL_MS = 30_000;

  async function checkConnection() {
    try {
      if (dbConnected) {
        await prisma.$queryRaw`SELECT 1`;
      } else {
        await prisma.$connect();
        dbConnected = true;
        dbError = "";
        logInfo("db Reconnected successfully");
      }
    } catch {
      if (dbConnected) {
        dbConnected = false;
        dbError = "Connection lost";
        console.warn(
          chalk.yellow("[db] Connection lost, will retry every 30s"),
        );
      }
    }
  }

  setInterval(checkConnection, HEARTBEAT_INTERVAL_MS).unref();
}

export async function closeDatabaseConnection() {
  await prisma.$disconnect();
  dbConnected = false;
}
