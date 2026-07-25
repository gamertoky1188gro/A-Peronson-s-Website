import { logger } from "../utils/logger.js";

const QUEUE = [];
let isProcessing = false;

function processNext() {
  const item = QUEUE.shift();
  if (!item) {
    isProcessing = false;
    return;
  }
  logger.info(`[Image Queue] Processing item: ${item}`);
  processNext();
}

export function startImageQueueWorker() {
  logger.info("[Image Queue] Worker started");
  if (QUEUE.length > 0 && !isProcessing) {
    processNext();
  }
}
