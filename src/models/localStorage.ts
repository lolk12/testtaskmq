import type { Code } from '@/const/data';
import {
  IS_COMPLETED_WRITE_DB_KEY,
  LAST_ADDED_ITEM_SPACE_KEY,
} from '../const/data';

// return key completed write in db current data for localStorage
const getIsCompletedKey = (code: Code) =>
  `${IS_COMPLETED_WRITE_DB_KEY}_${code}`;

// set flag for completed add items to indexedDB
export const completedWriteDB = (code: Code) => {
  localStorage.setItem(getIsCompletedKey(code), 'true');
};

// check is completed write in db
export const isCompletedWrite = (code: Code) =>
  localStorage.getItem(getIsCompletedKey(code)) === 'true';

// return key for last added item to indexedDB for localStorage
const getLastAddedItemKey = (key: string) =>
  `${LAST_ADDED_ITEM_SPACE_KEY}.${key}`;

// save last added item to indexedDB
export const saveLastAddedItem = (key: string, val: IDBValidKey) => {
  localStorage.setItem(getLastAddedItemKey(key), String(val));
};

// return key last added item to indexedDB
export const getLastAddedItem = (key: string) =>
  localStorage.getItem(getLastAddedItemKey(key));
