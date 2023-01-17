<script context="module" lang="ts">
  import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
  export let val: number;
  export let options = [];
  export let className = '';

  let isOpen = false;
  let activeItem = val;
  let selectEl: HTMLButtonElement;
  let optionsEl: HTMLDivElement;

  const dispatch = createEventDispatcher<{ change: number }>();

  const getOptionClassName = (year: number) => `.select-item_${year}`;

  const onChange = (val: number) => {
    isOpen = false;
    activeItem = val;

    dispatch('change', val);
  };

  const onClick = () => {
    isOpen = !isOpen;
  };

  $: activeItem = val;

  $: {
    if (isOpen && optionsEl) {
      const el = optionsEl.querySelector<HTMLButtonElement>(
        getOptionClassName(activeItem)
      );

      if (el) {
        el.focus();
      }
    }
  }

  const onBlur = (e: FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLButtonElement | null;

    if (relatedTarget === selectEl) {
      return;
    }

    if (!relatedTarget || relatedTarget?.parentNode !== optionsEl) {
      isOpen = false;
    }
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') {
      const index = options.indexOf(activeItem) + 1;
      activeItem = options[index];
    }

    if (e.code === 'ArrowUp') {
      const index = options.indexOf(activeItem) - 1;
      activeItem = options[index];
    }

    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
    }
  };
</script>

<button
  on:click={onClick}
  on:keydown={onKeyPress}
  on:blur={onBlur}
  class={`select-wrapper ${className}`}
  bind:this={selectEl}
  tabindex="0"
>
  <div class="select-wrapper__value">
    {val}
  </div>
  {#if isOpen}
    <div bind:this={optionsEl} class="options">
      {#each options as year (year)}
        <button
          on:click={(e) => {
            e.stopPropagation();
            onChange(year);
          }}
          on:blur={onBlur}
          class={`options__item select-item_${year}`}
        >
          {year}
        </button>
      {/each}
    </div>
  {/if}
  <div
    class={isOpen
      ? 'select-wrapper__arrow select-wrapper__arrow_open'
      : 'select-wrapper__arrow'}
  >
    <svg
      class="select-arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 5.887l8.468 14.113h-16.936l8.468-14.113zm0-3.887l-12 20h24l-12-20z"
      />
    </svg>
  </div>
</button>

<style>
  :root {
    --select-component_height: 30px;
    --select-component_border-size: 2px;
  }

  .select-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    outline: none;
    border: none;
    border: var(--select-component_border-size) solid var(--primary);
    background-color: #fff;
    width: 300px;
    height: var(--select-component_height);
    position: relative;
    cursor: pointer;
  }

  .select-wrapper__value {
    height: 100%;
    width: 100%;
    text-align: left;
    padding-left: 8px;
    display: flex;
    align-items: center;
    border-right: var(--select-component_border-size) solid var(--primary);
  }

  .select-wrapper__value:focus ~ .select-wrapper__arrow {
    outline: none;
    border: var(--select-component_border-size) solid rgb(121, 145, 176);
    border-left: none;
  }

  .select-wrapper:focus {
    outline: none;
  }

  .select-wrapper__arrow {
    width: var(--select-component_height);
    height: var(--select-component_height);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotateZ(180deg);
    transition: all 0.4s;
  }

  .select-wrapper__arrow_open {
    transform: rotateZ(0);
  }

  .select-arrow {
    width: 15px;
    height: 15px;
  }

  .select-arrow path {
    fill: var(--primary);
  }

  .options {
    position: absolute;
    width: calc(100% + var(--select-component_border-size) * 2);
    max-height: 50vh;
    overflow-y: auto;
    background-color: #fff;
    left: calc(0px - var(--select-component_border-size));
    top: calc(
      var(--select-component_height) - var(--select-component_border-size)
    );
    z-index: 2;
    border: var(--select-component_border-size) solid var(--primary);
    border-top: none;
  }

  .options__item {
    display: block;
    width: 100%;
    padding: 8px 4px;
    text-align: left;
    opacity: 1;
    cursor: pointer;
  }

  .options__item:not(:last-child) {
    border-bottom: var(--select-component_border-size) solid var(--primary);
  }

  .first-select {
    border-right: none;
  }
</style>
