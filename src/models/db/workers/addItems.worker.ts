import type { ItemData } from '@/types';

import { PRECIPITATION_CODE, TEMPERATURE_CODE } from '@/const/data';

import type { Config } from '../db';
import * as dbModel from '../db';
import { getNotAddedItems } from '../utils/getNotAddedItems';

// add new row to the table
export const add = <T>(val: T, objectStore: IDBObjectStore) => {
  return dbModel.wrap(objectStore.add(val));
};

type AddItemsArgs = {
  db: IDBDatabase;
  items: ItemData[] | undefined;
  key: Config['dbObjectKey'];
};

// add new many row to the table
const addItems = ({ items, db, key }: AddItemsArgs) => {
  if (!items) {
    console.error('No items');
    return [];
  }

  const tx = db.transaction(key, 'readwrite');
  const objectStore = tx.objectStore(key);

  const promises: Promise<IDBValidKey>[] = [];

  for (const item of items) {
    const request = add(item, objectStore);
    request.then((keyRow) => {
      postMessage({
        msg: 'addRowTable',
        data: {
          key,
          keyRow,
        },
      });
    });
    promises.push(request);
  }

  return promises;
};

// add all data in indexedDB
onmessage = async ({
  data: { dbName, dbVersion, data, lastAddedItem, code },
}) => {
  const DB = await dbModel.open(dbName, dbVersion);

  if (!DB) {
    console.error('IndexedDB is not available');
    close();
    return;
  }

  const notAddedItems = getNotAddedItems(lastAddedItem, data || []);

  return Promise.allSettled(
    addItems({
      db: DB,
      items: notAddedItems,
      key: code,
    })
  )
    .then(() => {
      postMessage({ msg: 'doneAddedItems' });
    })
    .finally(() => {
      close();
    });
};

export {};
