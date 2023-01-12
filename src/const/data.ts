// key for temperature data
export const TEMPERATURE_CODE = 'temperature';
// key for precipitation data
export const PRECIPITATION_CODE = 'precipitation';

type TemperatureType = typeof TEMPERATURE_CODE;
type PrecipitationType = typeof PRECIPITATION_CODE;
export type Code = TemperatureType | PrecipitationType;

// percentile for normalize data
export const COEFFICIENT = 0.5;

/*
  key for localStorage,
  needed to determine whether the write to the DB is completed or not
*/
export const IS_COMPLETED_WRITE_DB_KEY = 'isCompletedWriterDB';

// key for localStorage,to remember the last written DB element
export const LAST_ADDED_ITEM_SPACE_KEY = 'lastAddedItem';
