// Lightweight IndexedDB helper with safe SSR/unsupported fallbacks
// DB: PMGCache, Stores: projectDetails

const Stores = ['projectDetails', 'savedConfigs', 'logs'] as const;
type StoreName = (typeof Stores)[number];

const DB_NAME = 'PMGCache';
const DB_VERSION = 2; // Incremented for index addition

function isBrowserWithIDB(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

// Connection pool - reuse the DB connection for better performance
let dbPromise: Promise<IDBDatabase> | null = null;
let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  // Return cached instance if available and valid
  if (dbInstance && dbInstance.objectStoreNames.length > 0) {
    return Promise.resolve(dbInstance);
  }

  // Return in-flight promise if connection is being established
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    if (!isBrowserWithIDB()) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = event.oldVersion;

      Stores.forEach((storeName) => {
        let store: IDBObjectStore;

        if (!db.objectStoreNames.contains(storeName)) {
          store = db.createObjectStore(storeName, { keyPath: 'key' });
        } else {
          // Get existing store during upgrade transaction
          store = request.transaction!.objectStore(storeName);
        }

        // Add timestamp index for efficient time-based queries (v2)
        if (oldVersion < 2 && !store.indexNames.contains('timestamp')) {
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      });
    };

    request.onsuccess = () => {
      dbInstance = request.result;

      // Handle unexpected close/version change events
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
        dbPromise = null;
      };

      dbInstance.onclose = () => {
        dbInstance = null;
        dbPromise = null;
      };

      resolve(dbInstance);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error ?? new Error('Failed to open IndexedDB'));
    };
  });

  return dbPromise;
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

  // Optimized: batch multiple keys in a single transaction using a Map
  // This is more efficient than creating nested promises
  return new Promise<Array<T | undefined>>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const os = tx.objectStore(store);
    const results = new Map<string, T | undefined>();
    let pendingRequests = keyOrKeys.length;

    if (pendingRequests === 0) {
      resolve([]);
      return;
    }

    keyOrKeys.forEach((k) => {
      const req = os.get(k);
      req.onsuccess = () => {
        const rec = req.result as CacheRecord<T> | undefined;
        results.set(k, rec?.value);
        pendingRequests--;

        if (pendingRequests === 0) {
          // Preserve the original order
          resolve(keyOrKeys.map((key) => results.get(key)));
        }
      };
      req.onerror = () => {
        reject(req.error ?? new Error('IndexedDB get error'));
      };
    });
  });
}

async function idbGetAll<T = unknown>(
  store: StoreName,
): Promise<Record<string, T>> {
  if (!isBrowserWithIDB()) {
    return {};
  }
  const db = await openDB();

  // Using cursor for better memory efficiency with large datasets
  return new Promise<Record<string, T>>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const os = tx.objectStore(store);
    const result: Record<string, T> = {};

    // Use cursor for streaming results instead of loading all into memory at once
    const req = os.openCursor();

    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const record = cursor.value as CacheRecord<T>;
        result[record.key] = record.value;
        cursor.continue();
      } else {
        // No more entries
        resolve(result);
      }
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

/**
 * Efficiently set multiple key-value pairs in a single transaction.
 * Much faster than calling idbSet multiple times for bulk operations.
 */
async function idbSetMany<T = unknown>(
  store: StoreName,
  entries: Array<{ key: string; value: T }>,
): Promise<void> {
  if (!isBrowserWithIDB() || entries.length === 0) return;
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    const timestamp = Date.now();

    // Queue all put operations in the same transaction
    entries.forEach(({ key, value }) => {
      const rec: CacheRecord<T> = { key, value, timestamp };
      os.put(rec);
    });

    tx.oncomplete = () => {
      recordMutation(store);
      resolve();
    };

    tx.onerror = () => {
      reject(tx.error ?? new Error('IndexedDB setMany transaction error'));
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

/**
 * Delete multiple keys in a single transaction.
 * More efficient than calling idbDelete multiple times.
 */
async function idbDeleteMany(store: StoreName, keys: string[]): Promise<void> {
  if (!isBrowserWithIDB() || keys.length === 0) return;
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);

    // Queue all delete operations in the same transaction
    keys.forEach((key) => {
      os.delete(key);
    });

    tx.oncomplete = () => {
      recordMutation(store);
      resolve();
    };

    tx.onerror = () => {
      reject(tx.error ?? new Error('IndexedDB deleteMany transaction error'));
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

/**
 * Get items from a store within a timestamp range.
 * Useful for getting recent logs or cache entries.
 */
async function idbGetByTimestamp<T = unknown>(
  store: StoreName,
  minTimestamp?: number,
  maxTimestamp?: number,
): Promise<Array<{ key: string; value: T; timestamp: number }>> {
  if (!isBrowserWithIDB()) {
    return [];
  }
  const db = await openDB();

  return new Promise<Array<{ key: string; value: T; timestamp: number }>>(
    (resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const index = os.index('timestamp');

      // Create appropriate key range
      let range: IDBKeyRange | undefined;
      if (minTimestamp !== undefined && maxTimestamp !== undefined) {
        range = IDBKeyRange.bound(minTimestamp, maxTimestamp);
      } else if (minTimestamp !== undefined) {
        range = IDBKeyRange.lowerBound(minTimestamp);
      } else if (maxTimestamp !== undefined) {
        range = IDBKeyRange.upperBound(maxTimestamp);
      }

      const results: Array<{ key: string; value: T; timestamp: number }> = [];
      const req = index.openCursor(range);

      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const record = cursor.value as CacheRecord<T>;
          results.push({
            key: record.key,
            value: record.value,
            timestamp: record.timestamp,
          });
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      req.onerror = () =>
        reject(req.error ?? new Error('IndexedDB getByTimestamp error'));
    },
  );
}

export const Cache = {
  get: idbGet,
  getAll: idbGetAll,
  set: idbSet,
  setMany: idbSetMany,
  delete: idbDelete,
  deleteMany: idbDeleteMany,
  onChange,
  batch,
  deleteStore: idbDeleteStore,
  getByTimestamp: idbGetByTimestamp,
} as const;

export type { StoreName };
