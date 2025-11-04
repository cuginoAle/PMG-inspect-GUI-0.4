// Lightweight IndexedDB helper with safe SSR/unsupported fallbacks
// DB: PMGCache, Stores: projectDetails

const Stores = ['projectDetails', 'savedConfigs', 'logs'] as const;
type StoreName = (typeof Stores)[number];

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
      Stores.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

type CacheRecord<T> = { key: string; value: T; timestamp: number };

// --- Change listener infrastructure ---------------------------------------
type StoreChangeListener = (store: StoreName) => void;
const changeListeners = new Set<StoreChangeListener>();

// --- Batching infrastructure ----------------------------------------------
let batchLevel = 0; // supports nested batching
const pendingStores = new Set<StoreName>();

function recordMutation(store: StoreName) {
  if (batchLevel > 0) {
    pendingStores.add(store);
  } else {
    notifyChange(store);
  }
}

function flushPending() {
  if (pendingStores.size === 0) return;
  pendingStores.forEach((s) => notifyChange(s));
  pendingStores.clear();
}

function notifyChange(store: StoreName) {
  if (changeListeners.size === 0) return;
  // Fire listeners in try/catch so one failing listener doesn't block others.
  changeListeners.forEach((listener) => {
    try {
      listener(store);
    } catch (err) {
      // Swallow errors – optionally log in dev.
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[Cache] change listener failed', err);
      }
    }
  });
}

/** Register a callback fired whenever a store mutating operation completes.
 * Returns an unsubscribe function.
 */
function onChange(listener: StoreChangeListener): () => void {
  changeListeners.add(listener);
  return () => changeListeners.delete(listener);
}

/**
 * Get a value (or multiple values) from IndexedDB.
 * - When passing a single key (string), resolves to the stored value (or undefined).
 * - When passing multiple keys (string[]), resolves to an array of values in the same order.
 */
async function idbGet<T = unknown>(
  store: StoreName,
  key: string,
): Promise<T | undefined>;

async function idbGet<T = unknown>(
  store: StoreName,
  keys: string[],
): Promise<Array<T | undefined>>;

async function idbGet<T = unknown>(
  store: StoreName,
  keyOrKeys: string | string[],
): Promise<T | undefined | Array<T | undefined>> {
  if (!isBrowserWithIDB()) {
    return Array.isArray(keyOrKeys)
      ? keyOrKeys.map(() => undefined)
      : undefined;
  }
  const db = await openDB();

  if (!Array.isArray(keyOrKeys)) {
    return new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const req = os.get(keyOrKeys);
      req.onsuccess = () => {
        const rec = req.result as CacheRecord<T> | undefined;
        resolve(rec?.value);
      };
      req.onerror = () => reject(req.error ?? new Error('IndexedDB get error'));
    });
  }

  // Multiple keys in one transaction
  return new Promise<Array<T | undefined>>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const os = tx.objectStore(store);

    const promises = keyOrKeys.map(
      (k) =>
        new Promise<T | undefined>((res, rej) => {
          const req = os.get(k);
          req.onsuccess = () => {
            const rec = req.result as CacheRecord<T> | undefined;
            res(rec?.value);
          };
          req.onerror = () =>
            rej(req.error ?? new Error('IndexedDB get error'));
        }),
    );

    Promise.all(promises).then(resolve).catch(reject);
  });
}

async function idbGetAll<T = unknown>(
  store: StoreName,
): Promise<Record<string, T>> {
  if (!isBrowserWithIDB()) {
    return {};
  }
  const db = await openDB();

  return new Promise<Record<string, T>>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const os = tx.objectStore(store);
    const req = os.getAll();

    req.onsuccess = () => {
      const records = req.result as CacheRecord<T>[];
      const result: Record<string, T> = {};

      records.forEach((record) => {
        result[record.key] = record.value;
      });

      resolve(result);
    };

    req.onerror = () =>
      reject(req.error ?? new Error('IndexedDB getAll error'));
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
    req.onerror = () => reject(req.error ?? new Error('IndexedDB set error'));
    tx.oncomplete = () => {
      recordMutation(store);
      resolve();
    };
    tx.onerror = () => {
      // If transaction fails, ensure promise rejects (req.onerror might not fire for all cases)
      reject(tx.error ?? new Error('IndexedDB transaction error'));
    };
  });
}

async function idbDelete(store: StoreName, key: string): Promise<void> {
  if (!isBrowserWithIDB()) return;
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    const req = os.delete(key);
    req.onerror = () =>
      reject(req.error ?? new Error('IndexedDB delete error'));
    tx.oncomplete = () => {
      recordMutation(store);
      resolve();
    };
    tx.onerror = () => {
      reject(tx.error ?? new Error('IndexedDB transaction error'));
    };
  });
}

async function idbDeleteStore(store: StoreName): Promise<void> {
  if (!isBrowserWithIDB()) return;
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    const req = os.clear();
    req.onerror = () =>
      reject(req.error ?? new Error('IndexedDB clear store error'));
    tx.oncomplete = () => {
      recordMutation(store);
      resolve();
    };
    tx.onerror = () => {
      reject(tx.error ?? new Error('IndexedDB transaction error'));
    };
  });
}

/**
 * Batch multiple cache mutations so that only a single notification per store
 * is emitted after the batch completes. Supports nesting.
 *
 * Example:
 * await Cache.batch(async () => {
 *   await Cache.set('projectDetails', 'a', 1);
 *   await Cache.set('projectDetails', 'b', 2); // Only one notification fired
 * });
 */
async function batch<T>(fn: () => Promise<T> | T): Promise<T> {
  batchLevel++;
  try {
    const result = await fn();
    return result;
  } finally {
    batchLevel--;
    if (batchLevel === 0) {
      flushPending();
    }
  }
}

export const Cache = {
  get: idbGet,
  getAll: idbGetAll,
  set: idbSet,
  delete: idbDelete,
  onChange,
  batch,
  deleteStore: idbDeleteStore,
} as const;

export type { StoreName };
