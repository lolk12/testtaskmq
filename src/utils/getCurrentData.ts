import type { ItemData } from '../types';

export const TEMPERATURE_CODE = 'temperature'
export const PRECIPITATION_CODE = 'precipitation';

type TemperatureType = typeof TEMPERATURE_CODE;
type PrecipitationType = typeof PRECIPITATION_CODE;
export type Code = TemperatureType | PrecipitationType;

export const getCurrentData = (
  code: Code,
  temperature: ItemData[],
  precipitation: ItemData[],
) => {
  switch (code) {
  case 'precipitation':
    return precipitation;
  case 'temperature':
    return temperature
  default:
    return [];
  }
}
