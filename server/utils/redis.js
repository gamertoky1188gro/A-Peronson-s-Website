import { createClient } from "redis";
import chalk from "chalk";

let client = null;
let isConnected = false;

export async function initRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log(chalk.yellow("[redis] REDIS_URL not set - caching disabled"));
    return null;
  }

  try {
    client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.error(
              chalk.red("[redis] Max reconnection attempts reached"),
            );
            return new Error("Max retries reached");
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    client.on("error", (err) => {
      console.error(chalk.red("[redis] Client error:"), err.message);
      isConnected = false;
    });

    client.on("connect", () => {
      console.log(chalk.green("[redis] Connected to Redis"));
      isConnected = true;
    });

    client.on("disconnect", () => {
      console.log(chalk.yellow("[redis] Disconnected from Redis"));
      isConnected = false;
    });

    await client.connect();
    return client;
  } catch (err) {
    console.error(chalk.red("[redis] Failed to connect:"), err.message);
    return null;
  }
}

export function getRedisClient() {
  return client;
}

export function isRedisConnected() {
  return isConnected && client?.isOpen;
}

export async function cacheGet(key) {
  if (!isRedisConnected()) return null;
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error(chalk.red("[redis] cacheGet error:"), err.message);
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = 3600) {
  if (!isRedisConnected()) return false;
  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(chalk.red("[redis] cacheSet error:"), err.message);
    return false;
  }
}

export async function cacheDelete(key) {
  if (!isRedisConnected()) return false;
  try {
    await client.del(key);
    return true;
  } catch (err) {
    console.error(chalk.red("[redis] cacheDelete error:"), err.message);
    return false;
  }
}

export async function cacheInvalidatePattern(pattern) {
  if (!isRedisConnected()) return false;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (err) {
    console.error(
      chalk.red("[redis] cacheInvalidatePattern error:"),
      err.message,
    );
    return false;
  }
}

export async function closeRedis() {
  if (client) {
    await client.quit();
    client = null;
    isConnected = false;
  }
}
