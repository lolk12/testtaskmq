<script context="module" lang="ts">
  import { onMount } from 'svelte';

  import Graphic from './ui/Chart/Chart.svelte';

  import type { NormalizeDataReturn } from './utils/normalizeData/normalizeData';

  import { getDataForSelect } from './utils/getDataForSelect';
  import { getDataMap } from './utils/getDataMap';
  import { getRangeDefaultYears } from './utils/getRangeDefaultYears';
  import { wrapWorker } from './utils/wrapWorker';

  import type { Code } from './const/data';
  import { DB_NAME, PRECIPITATION_CODE, TEMPERATURE_CODE } from './const/data';

  import { getCurrentData, init } from './models/db';

  import Button from './ui/Button.svelte';
  import Select from './ui/Select.svelte';
</script>

<script lang="ts">
  let hasError = false;
  let isLoading = true;
  let code: Code = TEMPERATURE_CODE;

  let normalizeData: NormalizeDataReturn;
  let allDataMap: Map<Code, ReturnType<typeof getDataMap>>;

  const updateData = async () => {
    normalizeData = await wrapWorker<NormalizeDataReturn>(
      import('./utils/normalizeData/worker?worker'),
      {
        dataMap: allDataMap.get(code),
        startYear: selectStartYear,
        endYear: selectEndYear,
        dbObjectKey: code,
      }
    );
  };

  const onChangeStartYear = async (e: CustomEvent<number>) => {
    selectStartYear = e.detail;
    selectEndYear = Math.max(e.detail, selectEndYear);
    updateData();
  };

  const onChangeEndYear = async (e: CustomEvent<number>) => {
    selectEndYear = e.detail;
    selectStartYear = Math.min(e.detail, selectStartYear);
    updateData();
  };

  let selectStartYear: number;
  let selectEndYear: number;
  let rangeYears: ReturnType<typeof getRangeDefaultYears>;
  let selectOptions: number[] = [];

  const onClickButton = (val: Code) => async () => {
    code = val;
    if (allDataMap.has(code)) {
      updateData();
    } else {
      try {
        const data = await getCurrentData({
          dbName: DB_NAME,
          dbVersion: 1,
          code: val,
        });
        allDataMap.set(val, getDataMap(data));
        updateData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  onMount(async () => {
    try {
      await init(DB_NAME, 1);
      const data = await getCurrentData({
        dbName: DB_NAME,
        dbVersion: 1,
        code: TEMPERATURE_CODE,
      });

      allDataMap = new Map([[TEMPERATURE_CODE, getDataMap(data)]]);
      rangeYears = getRangeDefaultYears(data);
      selectStartYear = rangeYears?.startYear;
      selectEndYear = rangeYears?.endYear;
      selectOptions = getDataForSelect(
        rangeYears.startYear,
        rangeYears.endYear
      );

      await updateData();

      isLoading = false;
    } catch (e) {
      hasError = true;
      isLoading = false;
      console.error(e);
    }
  });
</script>

<main>
  <div class="wrapper">
    {#if !isLoading && !hasError}
      <h1>Архив метео службы</h1>
      <div class="grid-wrapper">
        <div class="select-actions-wrapper">
          <Select
            val={selectStartYear}
            options={selectOptions}
            className="first-select"
            on:change={onChangeStartYear}
          />
          <Select
            val={selectEndYear}
            options={selectOptions}
            on:change={onChangeEndYear}
          />
        </div>

        <div class="buttons-wrapper">
          <Button on:click={onClickButton(TEMPERATURE_CODE)}>Температура</Button
          >
          <Button on:click={onClickButton(PRECIPITATION_CODE)}>Осадки</Button>
        </div>
        <div class="chart-wrapper">
          <Graphic data={normalizeData} />
        </div>
      </div>
    {/if}
    {#if isLoading && !hasError}
      <div>Загрузка...</div>
    {/if}
    {#if hasError}
      <div>Ошибка</div>
    {/if}
  </div>
</main>

<style>
  .wrapper {
    display: grid;
    grid-auto-rows: min-content;
    justify-content: center;
  }
  .select-actions-wrapper {
    display: grid;
    grid-template-columns: max-content max-content;
    margin-bottom: 4px;
    grid-area: selects;
  }

  .buttons-wrapper {
    display: grid;
    grid-auto-rows: max-content;
    justify-content: flex-end;
    grid-row-gap: 4px;
    margin-right: 8px;
    grid-area: buttons;
  }

  .chart-wrapper {
    grid-area: chart;
  }

  .grid-wrapper {
    display: grid;
    grid-template:
      'buttons selects selects'
      'buttons chart chart'
      'buttons chart chart';
  }
</style>
