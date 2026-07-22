import prisma from "../utils/prisma.js";
import { compressImage, replaceWithCompressed } from "./imageProcessor.js";
import { logger } from "../utils/logger.js";

const QUEUE = [];
let isProcessing = false;
...
export function startImageQueueWorker() {
  logger.info("[Image Queue] Worker started");
  if (QUEUE.length > 0 && !isProcessing) {
    processNext();
  }
}
