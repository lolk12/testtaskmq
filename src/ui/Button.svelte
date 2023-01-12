<script context="module" lang="ts">
  import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
  const dispatch = createEventDispatcher<{ click: undefined }>();

  const onClick = () => {
    dispatch('click');
  };
</script>

<button on:click={onClick}>
  <slot />
</button>

<style>
  button {
    cursor: pointer;
    background-color: var(--primary);
    width: 150px;
    height: 50px;
    color: var(--text-color);
  }
</style>
