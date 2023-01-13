import type { ItemData } from '@/types';
import type { AllData } from '@/models/db/db';
import type { Code } from '@/const/data';

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

// getting Map with keys temperature and precipitation
export const getAllDataMap = (allData: AllData) => {
  const resultAllDataMap: Map<Code, ReturnType<typeof getDataMap>> = new Map();

  for (const [key, item] of Object.entries(allData)) {
    resultAllDataMap.set(key as Code, getDataMap(item));
  }

  return resultAllDataMap;
};
