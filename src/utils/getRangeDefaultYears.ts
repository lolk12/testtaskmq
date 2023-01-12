import type { ItemData } from 'src/types';

// return startYear and endYear from the data
export const getRangeDefaultYears = (data: ItemData[]) => ({
  startYear: new Date(data?.[0]?.t).getFullYear(),
  endYear: new Date(data?.[data.length - 1]?.t).getFullYear(),
});
