import type { ProcessedDocument } from "./types"

const DB_NAME = "pdf-to-markdown-db"
const DB_VERSION = 1
const STORE_NAME = "documents"

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("timestamp", "timestamp", { unique: false })
      }
    }
  })
}

// Save a document to IndexedDB
export async function saveDocument(document: ProcessedDocument): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.put(document)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Get all documents from IndexedDB
export async function getAllDocuments(): Promise<ProcessedDocument[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.getAll()

    request.onsuccess = () => {
      const documents = request.result
      // Sort by timestamp descending (newest first)
      documents.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      resolve(documents)
    }
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Get a single document by ID
export async function getDocument(
  id: string,
): Promise<ProcessedDocument | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.get(id)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Delete a document by ID
export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Clear all documents
export async function clearAllDocuments(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Get storage usage estimate (optional, for showing user how much space is used)
export async function getStorageEstimate(): Promise<{
  usage: number
  quota: number
  usagePercent: number
}> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage || 0
    const quota = estimate.quota || 0
    const usagePercent = quota > 0 ? (usage / quota) * 100 : 0

    return { usage, quota, usagePercent }
  }

  return { usage: 0, quota: 0, usagePercent: 0 }
}
