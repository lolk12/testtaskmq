import type { ItemData } from '@/types';

import { TEMPERATURE_CODE, PRECIPITATION_CODE } from '@/const/data';

import * as dbModel from '../db';
import type { Config } from '../db';
import { getNotAddedItems } from '../utils/getNotAddedItems';

// add new many row to the table
const addItems = (
  db: IDBDatabase,
  items: ItemData[] | undefined,
  key: Config['dbObjectKey']
) => {
  if (!items) {
    console.error('No items');
    return [];
  }

  const promises: Promise<IDBValidKey>[] = [];

  for (const item of items) {
    const request = dbModel.add(db, key, item);
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
  data: {
    dbName,
    dbVersion,
    temperature,
    precipitation,
    lastAddedItemTemperature,
    lastAddedItemPrecipitation,
  },
}) => {
  const DB = await dbModel.open(dbName, dbVersion, (innerDB) => {
    innerDB.createObjectStore(TEMPERATURE_CODE, { keyPath: 't' });
    innerDB.createObjectStore(PRECIPITATION_CODE, { keyPath: 't' });
  });

  if (!DB) {
    console.error('IndexedDB is not available');
    close();
    return;
  }

  const notAddedTemperatureItems = lastAddedItemTemperature
    ? getNotAddedItems(lastAddedItemTemperature, temperature || [])
    : temperature;

  const notAddedPrecipitationItems = lastAddedItemPrecipitation
    ? getNotAddedItems(lastAddedItemPrecipitation, precipitation || [])
    : precipitation;

  return Promise.allSettled([
    ...addItems(DB, notAddedTemperatureItems, TEMPERATURE_CODE),
    ...addItems(DB, notAddedPrecipitationItems, PRECIPITATION_CODE),
  ])
    .then(() => {
      postMessage({ msg: 'doneAddedItems' });
    })
    .finally(() => {
      close();
    });
};

export {};
