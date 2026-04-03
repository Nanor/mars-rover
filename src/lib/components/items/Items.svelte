<script lang="ts">
  import { type Player } from 'archipelago.js';
  import PlayerComponent from '../players/Player.svelte';
  import type { ReceivedItem } from '$lib/archipelago.svelte';
  import Item from './Item.svelte';

  const { items, players }: { items: ReceivedItem[]; players: Record<string, Player> } = $props();

  type ItemRow = {
    id: number;
    receiver: string;
    name: string;
    count: number;
    filler: boolean;
    useful: boolean;
    progression: boolean;
    trap: boolean;
  };

  const received = $derived(
    items.reduce<ItemRow[]>((acc, item) => {
      const prev = acc.find((i) => i.id === item.id && i.receiver === item.receiver);
      const rest = acc.filter((i) => !(i.id === item.id && i.receiver === item.receiver));

      return [
        ...rest,
        {
          ...item,
          count: prev ? prev.count + 1 : 1,
          filler: prev?.filler || item.filler,
          useful: prev?.useful || item.useful,
          progression: prev?.progression || item.progression,
          trap: prev?.trap || item.trap,
        },
      ];
    }, [])
  );

  let filtersOpen = $state(false);
  const filters = $state({
    trap: true,
    filler: true,
    useful: true,
    progression: true,
  });

  const filteredItems = $derived(
    received.filter(
      (i) =>
        (i.trap && filters.trap) ||
        (i.filler && filters.filler) ||
        (i.useful && filters.useful) ||
        (i.progression && filters.progression)
    )
  );
</script>

<div>
  <div>
    <h2>Items</h2>
    {#if filtersOpen}
      <button type="button" onclick={() => (filtersOpen = false)}>Close</button>
      <label><input type="checkbox" bind:checked={filters.trap} />Traps</label>
      <label><input type="checkbox" bind:checked={filters.filler} />Filler</label>
      <label><input type="checkbox" bind:checked={filters.useful} />Useful</label>
      <label><input type="checkbox" bind:checked={filters.progression} />Progression</label>
    {:else}
      <button type="button" onclick={() => (filtersOpen = true)}>Filters</button>
    {/if}
  </div>

  <table>
    <thead>
      <tr>
        <th>Receiver</th>
        <th>Count</th>
        <th>Item</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredItems.toReversed() as item (`${item.id}-${item.receiver}`)}
        <tr>
          <td><PlayerComponent player={players[item.receiver]} /></td>
          <td>{item.count}</td>
          <td><Item {item} /></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  table {
    display: block;
    height: 25vh;
    overflow-y: scroll;
  }

  thead {
    position: sticky;
    top: 0;
    background-color: white;
  }

  h2 {
    display: inline-block;
  }
</style>
