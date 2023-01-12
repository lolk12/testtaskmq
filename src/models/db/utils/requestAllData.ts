import type { ItemData } from 'src/types';
import { getData } from 'src/utils/getData';

export const requestAllData = () => {
  const temperaturePromise = getData<ItemData>('../data/temperature.json');
  const precipitationPromise = getData<ItemData>('../data/precipitation.json');

  return Promise.all<ItemData[]>([temperaturePromise, precipitationPromise]);
};
