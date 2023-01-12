import {
  IS_COMPLETED_WRITE_DB_KEY,
  LAST_ADDED_ITEM_SPACE_KEY,
} from '../const/data';

// set flag for complited add items to indexedDB
export const complitedWtiteDB = () => {
  localStorage.setItem(IS_COMPLETED_WRITE_DB_KEY, 'true');
};

// return key for last added item to indexedDB
const getLastAddedItemKey = (key: string) =>
  `${LAST_ADDED_ITEM_SPACE_KEY}.${key}`;

// save last added item to indexedDB
export const saveLastAddedItem = (key: string, val: IDBValidKey) => {
  localStorage.setItem(getLastAddedItemKey(key), String(val));
};

// return key last added item to indexedDB
export const getLastAddedItem = (key: string) =>
  localStorage.getItem(getLastAddedItemKey(key));
