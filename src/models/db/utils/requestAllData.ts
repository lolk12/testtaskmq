import type { Code } from '@/const/data';
import { PRECIPITATION_CODE, TEMPERATURE_CODE } from '@/const/data';
import type { ItemData } from '@/types';
import { getData } from '@/utils/getData';

export const requestCurrentData = (code: Code) => {
  if (code === TEMPERATURE_CODE) {
    return getData<ItemData>('../data/temperature.json');
  } else if (code === PRECIPITATION_CODE) {
    return getData<ItemData>('../data/precipitation.json');
  } else {
    return null;
  }
};
