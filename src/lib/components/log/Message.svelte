<script lang="ts">
  import { type MessageNode } from 'archipelago.js';
  import { onMount } from 'svelte';

  const { parts }: { parts: MessageNode[] } = $props();
  let element = $state<HTMLDivElement>();

  onMount(() => {
    element?.scrollIntoView();
  });
</script>

<div bind:this={element}>
  {#each parts as part, i (i)}
    <span class={part.type}>{part.text}</span>
  {/each}
</div>

<style>
  .player {
    color: purple;
  }
  .item {
    color: blue;
  }
  .location {
    color: green;
  }
</style>
