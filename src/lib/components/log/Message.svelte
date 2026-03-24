<script lang="ts">
  import { type MessageNode } from 'archipelago.js';
  import Player from '../players/Player.svelte';

  const { parts }: { parts: MessageNode[] } = $props();
  let element = $state<HTMLDivElement>();
</script>

<div bind:this={element}>
  {#each parts as part, i (i)}
    {#if part.type === 'player'}
      <span class="player"><Player player={part.player} /></span>
    {:else}
      <span class={part.type}>{part.text}</span>
    {/if}
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
