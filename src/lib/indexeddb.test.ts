/** @jest-environment jsdom */

import { Cache } from '@/src/lib/indexeddb';

type StoreName = 'projectDetails' | 'videoMetadata';

type CacheRecord<T> = { key: string; value: T; timestamp: number };

type DBData = Record<StoreName, Map<string, CacheRecord<unknown>>>;

const dbData: DBData = {
  projectDetails: new Map(),
  videoMetadata: new Map(),
};

// Minimal IndexedDB mock
function installIndexedDBMock() {
  const db = {
    objectStoreNames: {
      contains(name: StoreName) {
        return !!dbData[name];
      },
    },
    createObjectStore(name: StoreName) {
      if (!dbData[name]) {
        // dynamic create for tests
        // @ts-ignore
        dbData[name] = new Map();
      }
    },
    transaction(_name: StoreName, _mode: 'readonly' | 'readwrite') {
      return {
        objectStore(storeName: StoreName) {
          return {
            get(key: string) {
              const req: any = {};
              setTimeout(() => {
                const rec = dbData[storeName].get(key);
                req.result = rec;
                req.onsuccess && req.onsuccess();
              }, 0);
              return req;
            },
            put(rec: CacheRecord<unknown>) {
              const req: any = {};
              setTimeout(() => {
                dbData[storeName].set(rec.key, rec);
                req.onsuccess && req.onsuccess();
              }, 0);
              return req;
            },
          };
        },
      };
    },
  } as any;

  const indexedDBMock = {
    open(_name: string, _version?: number) {
      const request: any = { result: db };
      setTimeout(() => {
        if (typeof request.onupgradeneeded === 'function') {
          request.onupgradeneeded();
        }
        if (typeof request.onsuccess === 'function') {
          request.onsuccess();
        }
      }, 0);
      return request;
    },
  } as any;

  // assign to jsdom window
  // @ts-ignore
  window.indexedDB = indexedDBMock;
}

function uninstallIndexedDBMock() {
  // @ts-expect-error delete for tests
  delete window.indexedDB;
}

beforeAll(() => {
  installIndexedDBMock();
});

afterAll(() => {
  uninstallIndexedDBMock();
});

beforeEach(() => {
  dbData.projectDetails.clear();
  dbData.videoMetadata.clear();
});

describe('Cache IndexedDB helpers', () => {
  test('get returns undefined for missing key', async () => {
    const val = await Cache.get('projectDetails', 'missing');
    expect(val).toBeUndefined();
  });

  test('set then get returns stored value', async () => {
    await Cache.set('projectDetails', 'a', { foo: 1 });
    const val = await Cache.get<{ foo: number }>('projectDetails', 'a');
    expect(val).toEqual({ foo: 1 });
  });

  test('multi-key get returns values aligned with keys', async () => {
    await Cache.set('projectDetails', 'a', 1);
    await Cache.set('projectDetails', 'b', 2);
    const vals = await Cache.get<number>('projectDetails', ['a', 'b', 'c']);
    expect(vals).toEqual([1, 2, undefined]);
  });

  test('SSR fallback: returns undefineds when indexedDB missing', async () => {
    // Temporarily remove indexedDB
    const original = (window as any).indexedDB;
    // test mutation
    // @ts-ignore
    delete (window as any).indexedDB;

    const single = await Cache.get('projectDetails', 'x');
    expect(single).toBeUndefined();

    const multi = await Cache.get('projectDetails', ['x', 'y']);
    expect(multi).toEqual([undefined, undefined]);

    // Restore
    (window as any).indexedDB = original;
  });
});
