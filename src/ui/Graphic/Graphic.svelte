<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import type { ItemData } from '../../types';
  import { normalizeData } from '../../utils/normalizeData';
  import { getDataForSelect } from './utils/getDataForSelect';
  import { getCurrentData, TEMPERATURE_CODE, PRECIPITATION_CODE } from '../../utils/getCurrentData'
  import type { Code } from '../../utils/getCurrentData'
  import { getRangeDefaultYears } from './utils/getRangeDefaultYears';

  export let precipitation: ItemData[];
  export let temperature: ItemData[];

  let code: Code = TEMPERATURE_CODE;
  let data: ItemData[] = getCurrentData(code, temperature, precipitation);
  $:data = getCurrentData(code, temperature, precipitation);
  const onClickButton = (val: Code) => () => code = val;

  const rangeYears = getRangeDefaultYears(data);

  let startYear = rangeYears.startYear;
  let endYear = rangeYears.endYear;

  const DPI = 2;

  const WIDTH = 1000;
  const HEIGHT = 400;

  const WIDTH_DPI = WIDTH * DPI;
  const HEIGHT_DPI = HEIGHT * DPI;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    canvas.style.width = `${WIDTH}px`
    canvas.style.height = `${HEIGHT}px`
    canvas.width = WIDTH_DPI;
    canvas.height = HEIGHT_DPI;
  })

  afterUpdate(() => {
    const ctx = canvas.getContext('2d');

    let y = 0;

    function render() {
      const resultData = normalizeData(data, startYear, endYear);

      const ratio = Number((HEIGHT_DPI / (resultData.max - resultData.min)).toFixed(5))

      ctx.resetTransform()
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.translate(0, canvas.height);
      ctx.rotate(-Math.PI/2);
      ctx.beginPath();

      for (let val of resultData.days) {
        const x = (val - resultData.min) * ratio;

        ctx.lineTo(x, y);
        y += WIDTH_DPI / resultData.days.length;
      }

      ctx.stroke();
      ctx.closePath();
    }

    requestAnimationFrame(render);
  })

</script>

<div>
  <select bind:value={startYear}>
    {#each getDataForSelect(rangeYears.startYear, endYear) as year}
      <option value="{year}">{year}</option>
    {/each}
  </select>
  <select bind:value={endYear}>
    {#each getDataForSelect(startYear, rangeYears.endYear) as year}
      <option value="{year}">{year}</option>
    {/each}
  </select>
  <button on:click={onClickButton(TEMPERATURE_CODE)}>Температура</button>
  <button on:click={onClickButton(PRECIPITATION_CODE)}>Осадки</button>
  <canvas bind:this={canvas} width="500" height="500" />
</div>

<style>
  canvas {
    display: flex;
    border: 1px solid #333;
    margin: 0 auto;
  }
</style>

