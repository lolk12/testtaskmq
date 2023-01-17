import type { ItemData } from '@/types';

import { PRECIPITATION_CODE, TEMPERATURE_CODE } from '@/const/data';

export type Config = {
  start?: string;
  end?: string;
  index: string;
  open?: boolean;
  dbObjectKey: string;
};

export type AllData = {
  [TEMPERATURE_CODE]: ItemData[];
  [PRECIPITATION_CODE]: ItemData[];
};

export const wrap = <T>(req: IDBOpenDBRequest | IDBRequest<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
};

/* Returned range data from the table 
* config.start --> return all items >= start ||
   if config.open === false --> return items > start
* config.end --> return all items <= end ||
   if config.open === false --> return items > end
* config.start && config.end --> return items >= start && items <= end ||
    if config.open === false --> return items > start && items < end
* */
export const getRangeData = async <T>(
  db: IDBDatabase,
  { dbObjectKey, start, end, open }: Omit<Config, 'index'>
) => {
  const tx = db.transaction(dbObjectKey, 'readonly', { durability: 'relaxed' });
  const objectStore = tx.objectStore(dbObjectKey);

  let request: T[];

  if (start && end) {
    request = await wrap<T[]>(
      objectStore.getAll(IDBKeyRange.bound(start, end, Boolean(open)))
    );
  } else if (start) {
    request = await wrap<T[]>(
      objectStore.getAll(IDBKeyRange.upperBound(start, Boolean(open)))
    );
  } else {
    request = await wrap<T[]>(
      objectStore.getAll(IDBKeyRange.lowerBound(end, Boolean(open)))
    );
  }

  return request;
};

// returned all data from the table
export const getAll = async <T>(
  db: IDBDatabase,
  dbObjectKey: Config['dbObjectKey']
) => {
  const tx = db.transaction(dbObjectKey, 'readonly', { durability: 'relaxed' });
  const objectStore = tx.objectStore(dbObjectKey);

  return wrap<T[]>(objectStore.getAll());
};

// returned the row from the table
export const get = <T>(
  db: IDBDatabase,
  dbObjectKey: Config['dbObjectKey'],
  index: Config['index']
) => {
  const tx = db.transaction(dbObjectKey, 'readonly', { durability: 'relaxed' });
  const objectStore = tx.objectStore(dbObjectKey);

  return wrap<T[]>(objectStore.get(index));
};

export const open = (
  dbName: string,
  dbVersion: number,
  cb?: (innerDB: IDBDatabase) => void
): Promise<IDBDatabase> | null => {
  if (!indexedDB) {
    return null;
  }
  const openRequest = indexedDB.open(dbName, dbVersion);

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;

    if (cb) {
      cb(db);
    }
  };

  return wrap(openRequest);
};
