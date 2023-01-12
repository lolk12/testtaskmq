<script context="module" lang="ts">
  import { onMount } from 'svelte';

  import Graphic from './ui/Chart/Chart.svelte';

  import type { NormalizeDataReturn } from './utils/normalizeData/normalizeData';

  import { getDataForSelect } from './utils/getDataForSelect';
  import { getRangeDefaultYears } from './utils/getRangeDefaultYears';
  import { getAllDataMap } from './utils/getDataMap';
  import { wrapWorker } from './utils/wrapWorker';

  import { TEMPERATURE_CODE, PRECIPITATION_CODE } from './const/data';
  import type { Code } from './const/data';

  import { init } from './models/db';

  import Select from './ui/Select.svelte';
  import Button from './ui/Button.svelte';
</script>

<script lang="ts">
  let hasError = false;
  let isLoading = true;
  let code: Code = TEMPERATURE_CODE;

  let normalizeData: NormalizeDataReturn;
  let allDataMap: ReturnType<typeof getAllDataMap>;

  const updateData = async () => {
    normalizeData = await wrapWorker<NormalizeDataReturn>(import('./utils/normalizeData/worker?worker'), {
      dataMap: allDataMap.get(code),
      startYear: selectStartYear,
      endYear: selectEndYear,
      dbObjectKey: code,
    });
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

  const onClickButton = (val: Code) => () => {
    code = val;
    updateData();
  };

  onMount(async () => {
    try {
      const { allData } = await init('db', 1);

      allDataMap = getAllDataMap(allData);
      const currentData = allData[code];

      rangeYears = getRangeDefaultYears(currentData);
      selectStartYear = rangeYears?.startYear;
      selectEndYear = rangeYears?.endYear;
      selectOptions = getDataForSelect(rangeYears.startYear, rangeYears.endYear);

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
          <Select val={selectEndYear} options={selectOptions} on:change={onChangeEndYear} />
        </div>

        <div class="buttons-wrapper">
          <Button on:click={onClickButton(TEMPERATURE_CODE)}>Температура</Button>
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
