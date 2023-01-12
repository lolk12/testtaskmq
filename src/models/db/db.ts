import type { ItemData } from 'src/types';

import { TEMPERATURE_CODE, PRECIPITATION_CODE } from 'src/const/data';

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

const wrap = <T>(req: IDBOpenDBRequest | IDBRequest<T>): Promise<T> => {
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

// add new row to the table
export const add = <T>(
  db: IDBDatabase,
  dbObjectKey: Config['dbObjectKey'],
  val: T
) => {
  const tx = db.transaction(dbObjectKey, 'readwrite');
  const objectStore = tx.objectStore(dbObjectKey);

  return wrap(objectStore.add(val));
};

export const open = (
  dbName: string,
  dbVersion: number,
  cb: (innerDB: IDBDatabase) => void
) => {
  const openRequest = indexedDB.open(dbName, dbVersion);

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;

    cb(db);
  };

  return wrap(openRequest);
};
