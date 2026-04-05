export function logInfo(message, data = null) {
  const stamp = new Date().toISOString()
  if (data) {
    console.log(`[INFO] ${stamp} ${message}`, data)
    return
  }
  console.log(`[INFO] ${stamp} ${message}`)
}

export function logWarn(message, data = null) {
  const stamp = new Date().toISOString()
  if (data) {
    console.warn(`[WARN] ${stamp} ${message}`, data)
    return
  }
  console.warn(`[WARN] ${stamp} ${message}`)
}

export function logError(message, error = null) {
  const stamp = new Date().toISOString()
  if (error) {
    console.error(`[ERROR] ${stamp} ${message}`, error)
    return
  }
  console.error(`[ERROR] ${stamp} ${message}`)
}
