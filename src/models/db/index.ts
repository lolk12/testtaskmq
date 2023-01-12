import type { ItemData } from 'src/types';

import { TEMPERATURE_CODE, PRECIPITATION_CODE, IS_COMPLETED_WRITE_DB_KEY } from 'src/const/data';
import { wrapWorker } from 'src/utils/wrapWorker';

import * as localStore from '../localStorage'

import { requestAllData }  from './utils/requestAllData';
import * as dbModel from './db'
import type { AllData } from './db'


// init DB and return all data from the database or server
export const init = async (dbName: string, dbVersion: number) => {
  const isCompletedWriterDB = localStorage.getItem(IS_COMPLETED_WRITE_DB_KEY) === 'true';
  

  // all data requested from the database or server
  const allData: AllData = {
    [TEMPERATURE_CODE]: [],
    [PRECIPITATION_CODE]: []
  };

  const DB = await dbModel.open(dbName, dbVersion, (innerDB) => {
    innerDB.createObjectStore(TEMPERATURE_CODE, {keyPath: 't'});
    innerDB.createObjectStore(PRECIPITATION_CODE, {keyPath: 't'});
  })

  try {
    if(isCompletedWriterDB) {
    
      const [temperature, precipitation] = await Promise.all<ItemData[]>([
        dbModel.getAll<ItemData>(DB, TEMPERATURE_CODE),
        dbModel.getAll<ItemData>(DB, PRECIPITATION_CODE)
      ])
    
      allData[TEMPERATURE_CODE] = temperature ;
      allData[PRECIPITATION_CODE] = precipitation;
      return { DB, allData };
    }
  } catch (err) {
    throw new Error('Error load data')
  }
  
  
  try {
    const lastAddedItemTemperature = localStore.getLastAddedItem(TEMPERATURE_CODE);
    const lastAddedItemPrecipitation = localStore.getLastAddedItem(PRECIPITATION_CODE);
    const [ temperature, precipitation ] = await requestAllData();
  
    allData[TEMPERATURE_CODE] = temperature ;
    allData[PRECIPITATION_CODE] = precipitation;
      
    const onWorkerMessage = (
      { data: { msg, data } }: MessageEvent<{msg: string; data: { key: string;  keyRow: string}}>
    ) => {
        
      if(msg === 'addRowTable') {
        localStore.saveLastAddedItem(data.key, data.keyRow)
      }
      if(msg === 'doneAddedItems') {
        localStore.complitedWtiteDB();
      }
    };
  
    wrapWorker(
      import('./workers/addItems.worker?worker'),
      {
        dbName,
        dbVersion,
        temperature,
        precipitation,
        isComplitedWriterDB: isCompletedWriterDB,
        lastAddedItemTemperature,
        lastAddedItemPrecipitation
      },
      onWorkerMessage
    )
  
  } catch (err) {
    throw new Error(err.message);
  }
  
  return { DB, allData };
}