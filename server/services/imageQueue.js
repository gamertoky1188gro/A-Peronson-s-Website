import prisma from "../utils/prisma.js";
import { compressImage, replaceWithCompressed } from "./imageProcessor.js";

const QUEUE = [];
let isProcessing = false;

export function addImageToQueue(job) {
  QUEUE.push(job);
  if (!isProcessing) {
    processNext();
  }
}

async function updateDoc(documentId, data) {
  if (!documentId) return;
  try {
    await prisma.document.update({ where: { id: documentId }, data });
  } catch {
    // document record may not exist (e.g. message attachments without doc)
  }
}

async function processNext() {
  if (QUEUE.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const job = QUEUE.shift();
  const { filePath, documentId } = job;

  try {
    await updateDoc(documentId, { video_status: "processing" });

    const compressedPath = await compressImage(filePath);
    const result = replaceWithCompressed(filePath, compressedPath);

    await updateDoc(documentId, {
      video_status: result.replaced ? "processed" : "skipped",
    });
  } catch (_err) {
    await updateDoc(documentId, { video_status: "failed" });
  }

  setImmediate(processNext);
}

export function startImageQueueWorker() {
  console.log("[Image Queue] Worker started");
  if (QUEUE.length > 0 && !isProcessing) {
    processNext();
  }
}
