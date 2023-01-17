import type { Code } from '@/const/data';
import { PRECIPITATION_CODE, TEMPERATURE_CODE } from '@/const/data';
import type { ItemData } from '@/types';
import { wrapWorker } from '@/utils/wrapWorker';

import * as localStore from '@/models/localStorage';

import { requestCurrentData } from './utils/requestAllData';

import * as dbModel from './db';

export let DB: IDBDatabase | null = null;

// init DB and return all data from the database or server
export const init = async (dbName: string, dbVersion: number) => {
  try {
    DB = await dbModel.open(dbName, dbVersion, (innerDB) => {
      innerDB.createObjectStore(TEMPERATURE_CODE, { keyPath: 't' });
      innerDB.createObjectStore(PRECIPITATION_CODE, { keyPath: 't' });
    });

    if (!DB) {
      console.error('IndexedDB is not available');
    }

    return DB;
  } catch (err) {
    throw new Error('Error load data');
  }
};

type GetCurrentDataArgs = {
  code: Code;
  dbName: string;
  dbVersion: number;
};

export const getCurrentData = async ({
  code,
  dbName,
  dbVersion,
}: GetCurrentDataArgs) => {
  if (!DB) {
    throw new Error('indexedDB not open');
  }
  const isCompletedWriterDB = localStore.isCompletedWrite(code);

  try {
    if (isCompletedWriterDB) {
      return dbModel.getAll<ItemData>(DB, code);
    }
  } catch (err) {
    throw new Error('Error load data from indexedDB');
  }

  try {
    const data = await requestCurrentData(code);
    const lastAddedItem = localStore.getLastAddedItem(code);

    const onWorkerMessage = ({
      data: { msg, data },
    }: MessageEvent<{
      msg: string;
      data: { key: string; keyRow: string };
    }>) => {
      if (msg === 'addRowTable') {
        localStore.saveLastAddedItem(data.key, data.keyRow);
      }
      if (msg === 'doneAddedItems') {
        localStore.completedWriteDB(code);
      }
    };

    wrapWorker(
      import('./workers/addItems.worker?worker'),
      {
        dbName,
        dbVersion,
        data,
        lastAddedItem,
        code,
      },
      onWorkerMessage
    );
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
