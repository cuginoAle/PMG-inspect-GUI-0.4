// Lightweight IndexedDB helper with safe SSR/unsupported fallbacks
// DB: PMGCache, Stores: projectDetails, videoMetadata

type StoreName = 'projectDetails' | 'videoMetadata';

const DB_NAME = 'PMGCache';
const DB_VERSION = 1;

function isBrowserWithIDB(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowserWithIDB()) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('projectDetails')) {
        db.createObjectStore('projectDetails', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('videoMetadata')) {
        db.createObjectStore('videoMetadata', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

type CacheRecord<T> = { key: string; value: T; timestamp: number };

async function idbGet<T = unknown>(
  store: StoreName,
  key: string,
): Promise<T | undefined> {
  if (!isBrowserWithIDB()) return undefined;
  const db = await openDB();
  return new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const os = tx.objectStore(store);
    const req = os.get(key);
    req.onsuccess = () => {
      const rec = req.result as CacheRecord<T> | undefined;
      resolve(rec?.value);
    };
    req.onerror = () => reject(req.error ?? new Error('IndexedDB get error'));
  });
}

async function idbSet<T = unknown>(
  store: StoreName,
  key: string,
  value: T,
): Promise<void> {
  if (!isBrowserWithIDB()) return;
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    const rec: CacheRecord<T> = { key, value, timestamp: Date.now() };
    const req = os.put(rec);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error('IndexedDB set error'));
  });
}

export const Cache = {
  get: idbGet,
  set: idbSet,
} as const;
