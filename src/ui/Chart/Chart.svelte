<script context="module" lang="ts">
  import { onMount, afterUpdate } from 'svelte';

  import type { NormalizeDataReturn } from '../../utils/normalizeData/normalizeData';

  import { clearCanvas } from './utils/clearCanvas';
  import { paintCoords } from './utils/paintCoords';
  import { paintText } from './utils/paintText';
  import { initStyleCanvas } from './utils/initStyleCanvas';
</script>

<script lang="ts">
  export let data: NormalizeDataReturn;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    initStyleCanvas(canvas);
  });

  afterUpdate(() => {
    const ctx = canvas.getContext('2d');

    clearCanvas(ctx, canvas);
    paintCoords(ctx, data);
    paintText(ctx, data.min, data.max);
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    display: flex;
    border: 2px solid var(--primary);
  }
</style>
