import type { ItemData } from '@/types';

export type DataMap = Map<number, number[]>;

// getting Map with keys year and values all days in the year
export const getDataMap = (data: ItemData[]) => {
  const dataMap: DataMap = new Map();

  data.forEach((item) => {
    const year = Number(item?.t.split('-')[0]);
    if (dataMap.has(year)) {
      const currentDays = dataMap.get(year) as number[];
      currentDays.push(item.v);
      dataMap.set(year, currentDays);
    } else {
      dataMap.set(year, [item.v]);
    }
  });

  return dataMap;
};
