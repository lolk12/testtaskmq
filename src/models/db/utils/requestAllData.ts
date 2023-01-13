import type { ItemData } from '@/types';
import { getData } from '@/utils/getData';

export const requestAllData = () => {
  const temperaturePromise = getData<ItemData>('../data/temperature.json');
  const precipitationPromise = getData<ItemData>('../data/precipitation.json');

  return Promise.all<ItemData[]>([temperaturePromise, precipitationPromise]);
};
