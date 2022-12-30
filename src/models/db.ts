import type { ItemData } from '../types';

type Config = {
  start?: string;
  end?: string;
  index: string;
  open?: boolean;
  dbObjectKey: string;
}

export const dbOpen = (dbName: string, dbVersion, cb: (db: IDBDatabase) => Promise<void> | void) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open('db', 1)

    openRequest.onerror = () => {
      reject();
    }

    openRequest.onsuccess = () => resolve(openRequest.result);

    openRequest.onupgradeneeded = async () => {
      const db = openRequest.result;
      try {
        await cb(db);
      } catch (e) {
        reject(e);
      }
      resolve(db);
    }
  })

/*
* config.start --> return all items >= start || if config.open === false --> return items > start
* config.end --> return all items <= end || if config.open === false --> return items > end
* config.start && config.end --> return items >= start && items <= end || if config.open === false --> return items > start && items < end
* */
export const getRangeData = (db: IDBDatabase, { dbObjectKey, start, end, open }: Omit<Config, 'index'>) => {
  const tx = db.transaction(dbObjectKey, 'readonly', { durability: 'relaxed' });
  const objectStore = tx.objectStore(dbObjectKey);

  return new Promise((resolve, reject) => {
    let request: IDBRequest<ItemData[]>;

    if(start && end) {
      request = objectStore.getAll(IDBKeyRange.bound(start, end, Boolean(open)));
    } else if(start) {
      request = objectStore.getAll(IDBKeyRange.upperBound(start, Boolean(open)));
    } else {
      request = objectStore.getAll(IDBKeyRange.lowerBound(end, Boolean(open)));
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject('Get range data error');
    }
  })
}

export const getAllData = async (db: IDBDatabase, dbObjectKey: Config['dbObjectKey']) => {
  const tx = db.transaction(dbObjectKey, 'readonly', { durability: 'relaxed' });
  const objectStore = tx.objectStore(dbObjectKey);


  return new Promise((resolve, reject) => {
    const request = objectStore.getAll();

    request.onerror = () => {
      reject('Get all data error')
    }
    request.onsuccess = () => {
      resolve(request.result)
    }
  });
}

export const get = (db: IDBDatabase, dbObjectKey: Config['dbObjectKey'], index: Config['index']) => {
  const tx = db.transaction(dbObjectKey, 'readonly', { durability: 'relaxed' });
  const objectStore = tx.objectStore(dbObjectKey);

  return new Promise((resolve, reject) => {
    const request = objectStore.get(index);

    request.onerror = () => {
      reject('Get item error')
    }
    request.onsuccess = () => {
      resolve(request.result)
    }
  });
}


export const addItems = (db: IDBDatabase, items:  ItemData[] | undefined, key: Config['dbObjectKey']) => {
  const tx = db.transaction(key, 'readwrite', { durability: 'relaxed' });
  const objectStore = tx.objectStore(key);

  return new Promise((resolve, reject) => {
    if(!items) {
      reject('items is undefined')
      return;
    }
    for (const item of items) {
      objectStore.add(item)
    }
    tx.commit();


    tx.oncomplete = resolve;
    tx.onerror = reject;

  })

}

