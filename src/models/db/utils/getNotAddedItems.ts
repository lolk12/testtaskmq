import type { ItemData } from 'src/types';

// return data that was not added in the last visit
export const getNotAddedItems = (lastAddedKey: string, items: ItemData[]) => {
  const indexLastAddedItem = items.findIndex(item => item.t === lastAddedKey) + 1;

  return items.slice(indexLastAddedItem);
};
