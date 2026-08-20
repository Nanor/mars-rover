<script lang="ts">
  import { type Player } from '$lib/archipelago.svelte';
  import PlayerComponent from '../players/Player.svelte';
  import type { ReceivedItem } from '$lib/archipelago.svelte';
  import Item from './Item.svelte';

  const {
    items,
    players,
    groups,
    lookupItemName,
  }: {
    items: ReceivedItem[];
    players: Record<string, Player>;
    groups: string[];
    lookupItemName: (game: string, id: number) => string;
  } = $props();

  type ItemRow = {
    id: number;
    receiver: string;
    name: string;
    count: number;
    filler: boolean;
    useful: boolean;
    progression: boolean;
    trap: boolean;
    groups: string[];
  };

  const received = $derived(
    items.reduce<ItemRow[]>((acc, item) => {
      const prev = acc.find((i) => i.id === item.id && i.receiver === item.receiver);
      const rest = acc.filter((i) => !(i.id === item.id && i.receiver === item.receiver));

      return [
        ...rest,
        {
          ...item,
          name: lookupItemName(item.game, item.id),
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
  <div class="filters">
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
          <td><Item {item} {groups} /></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .filters,
  thead {
    position: sticky;
    background-color: var(--clr-neutral-100);
  }

  .filters {
    top: 24px;
  }
  thead {
    top: 47px;
  }
</style>
