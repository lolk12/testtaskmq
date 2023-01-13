import { COEFFICIENT } from '@/const/data';
import { PADDING_COORDS, WIDTH_DPI } from '@/const/chart';

// get data for a range of years
export const getRangeDays = (
  dataMap: Map<number, number[]>,
  startYear: number,
  endYear: number
) => {
  let result: number[] = [];

  if (startYear > endYear) {
    return [];
  }

  for (const [yearKey, days] of dataMap.entries()) {
    if (yearKey < startYear) {
      continue;
    }
    if (yearKey > endYear) {
      break;
    }
    result = [...result, ...days];
  }

  return result;
};

export const getSizeStep = (
  length: number,
  width = WIDTH_DPI,
  padding = PADDING_COORDS
) => Math.floor(length / (width / padding)) || 1;

export const isSmallData = (length: number, stepSize: number) =>
  length < stepSize * 0.5;

export type NormalizeDataArgs = {
  startYear: number;
  endYear: number;
  dataMap: Map<number, number[]>;
};

export const normalizeData = ({
  startYear,
  endYear,
  dataMap,
}: NormalizeDataArgs) => {
  let min: number = Number.MAX_SAFE_INTEGER;
  let max: number = Number.MIN_SAFE_INTEGER;

  const resultDays: number[] = [];

  const rangeDays = getRangeDays(dataMap, startYear, endYear);

  const SIZE_STEP = getSizeStep(rangeDays.length);

  let i = 0;
  while (i < rangeDays.length) {
    // getting next index with ignore length rangeDays
    const nextIndex = i + SIZE_STEP;

    // sorting data and get percentile
    const sortedCurrentDays = rangeDays
      .slice(i, nextIndex)
      .sort((a, b) => (a > b ? +1 : -1));
    const percentile = Math.floor(COEFFICIENT * sortedCurrentDays.length);
    const percentileRankDay = sortedCurrentDays[percentile];

    // skip step if remaining step has < half size step
    if (isSmallData(sortedCurrentDays.length, SIZE_STEP)) {
      i = nextIndex;
      continue;
    }

    // init min or max values
    if (i === 0) {
      min = percentileRankDay;
      max = percentileRankDay;
    }

    //save min or max values in precentile days
    min = Math.min(percentileRankDay, min as number);
    max = Math.max(percentileRankDay, max as number);

    // save percentile
    resultDays.push(percentileRankDay);
    i = nextIndex;
  }

  return {
    min,
    max,
    days: resultDays,
  };
};

export type NormalizeDataReturn = ReturnType<typeof normalizeData>;
