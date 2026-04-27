<script lang="ts">
  import { type MessageNode } from '$lib/archipelago.svelte';
  import Player from '../players/Player.svelte';
  import Item from '../items/Item.svelte';

  const { parts, connections }: { parts: MessageNode[]; connections: string[] } = $props();
  let element = $state<HTMLDivElement>();
</script>

<div bind:this={element}>
  {#each parts as part, i (i)}
    {#if part.type === 'player'}
      <span class="player" class:connected={connections.includes(part.player.name)}>
        <Player player={part.player} />
      </span>
    {:else if part.type === 'item'}
      <Item item={part.item} />
    {:else}
      <span class={part.type}>{part.text}</span>
    {/if}
  {/each}
</div>

<style>
  div {
    margin-block-end: 0.2em;
  }

  .player {
    color: var(--clr-player);
  }
  .player.connected {
    color: var(--clr-connected);
  }
  .location {
    color: var(--clr-location);
  }
</style>
