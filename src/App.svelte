<script context="module" lang="ts">
  import { onMount } from 'svelte';
  import Graphic from './ui/Graphic/Graphic.svelte';
  import { getData } from './utils';
  import { TEMPERATURE_CODE, PRECIPITATION_CODE } from './utils/getCurrentData';
  import type { ItemData } from './types';
  import * as dbModel  from './models/db';
</script>

<script lang="ts">
  let hasError = false;
  let isLoading = true;
  const temperaturePromise = getData<ItemData>('../data/temperature.json');
  const precipitationPromise = getData<ItemData>('../data/precipitation.json');
  const data = Promise.all([temperaturePromise, precipitationPromise])

  onMount(async () => {
    try {
      const db = await dbModel.dbOpen('db', 1, async (db) => {
        if(!db.objectStoreNames.length) {
          db.createObjectStore(TEMPERATURE_CODE, {keyPath: 't'});
          db.createObjectStore(PRECIPITATION_CODE, {keyPath: 't'});

          const temperaturePromise = getData<ItemData>('../data/temperature.json');
          const precipitationPromise = getData<ItemData>('../data/precipitation.json');

          const allData = await Promise.allSettled<ItemData[]>([temperaturePromise, precipitationPromise])

          dbModel.addItems(db, allData?.values?.[0] , TEMPERATURE_CODE);
          dbModel.addItems(db, allData?.values?.[1], PRECIPITATION_CODE);

          return;
        }

        if(!db.objectStoreNames.contains(TEMPERATURE_CODE)) {
          db.createObjectStore(TEMPERATURE_CODE, {keyPath: 't'});

          const temperature = await getData<ItemData>('../data/temperature.json');

          dbModel.addItems(db, temperature, TEMPERATURE_CODE)
          return
        }

        if(!db.objectStoreNames.contains(PRECIPITATION_CODE)) {
          db.createObjectStore(PRECIPITATION_CODE, {keyPath: 't'});

          const precipitation = await getData<ItemData>('../data/precipitation.json');

          dbModel.addItems(db, precipitation, PRECIPITATION_CODE);
          return;
        }
      })


    } catch (e) {
      hasError = true;
      console.error(e);
    }

  })
</script>

<main>
  {#await data}
    <p>waiting...</p>
  {:then [temperature, precipitation]}
    <div>
      <Graphic temperature={temperature} precipitation={precipitation} />
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

  <br>
</main>

<style>

</style>
