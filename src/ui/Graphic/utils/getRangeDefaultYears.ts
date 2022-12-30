import type { ItemData } from '../../../types';

export const getRangeDefaultYears = (data: ItemData[]) => ({
  startYear: new Date(data?.[0]?.t).getFullYear(),
  endYear: new Date(data?.[data.length - 1]?.t).getFullYear(),
})
