import type { ItemData } from '../types';

const DATE_SEPARATOR = '-';

const getRangeDays = (data: ItemData[], startYear: number, endYear: number) => {
  let result: number[] = [];

  // TODO: вынести это в отдельную функцию и захостить на верх, что бы Map создавался один раз
  const dataMap = new Map<number, number[]>();

  data.forEach(item => {
    const year = Number(item?.t.split(DATE_SEPARATOR)[0]);
    if(dataMap.has(year)) {
      const currentDays = dataMap.get(year) as number[];
      currentDays.push(item.v);
      dataMap.set(year, currentDays);
    } else {
      dataMap.set(year, [item.v]);
    }
  })

  for(const [year, days] of dataMap.entries()) {
    if(year < startYear) {
      continue;
    }
    if(year > endYear) {
      break;
    }
    result = [...result, ...days];
  }

  return result;
}

export const normalizeData = (data: ItemData[], startYear: number, endYear: number) => {
  const COEFFICIENT = 0.85;
  const COUNT_ELEMENTS = 365;

  let min: number | undefined;
  let max: number | undefined;

  const resultDays: number[] = []

  const rangeDays = getRangeDays(data, startYear, endYear);

  const SIZE_STEP = Math.floor(rangeDays.length / COUNT_ELEMENTS) || 1;


  let i = 0;
  while (i < rangeDays.length) {
    const sortedCurrentDays = rangeDays.slice(i, i + SIZE_STEP).sort((a, b) => a > b ? +1 : -1)
    const percentile = Math.floor(COEFFICIENT * sortedCurrentDays.length)
    const percentileRankDay = sortedCurrentDays[percentile];

    if(min === undefined) min = percentileRankDay;
    if(max === undefined) max = percentileRankDay;

    min = Math.min(percentileRankDay, min);
    max = Math.max(percentileRankDay, max);
    resultDays.push(percentileRankDay);
    i += SIZE_STEP;
  }

  return {
    min,
    max,
    days: resultDays,
  };
}
