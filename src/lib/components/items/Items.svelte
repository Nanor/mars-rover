<script lang="ts">
  import { type Player } from 'archipelago.js';
  import PlayerComponent from '../players/Player.svelte';
  import type { ReceivedItem } from '$lib/archipelago.svelte';

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
</script>

<div>
  <h2>Items</h2>

  <table>
    <thead>
      <tr>
        <th>Receiver</th>
        <th>Count</th>
        <th>Item</th>
      </tr>
    </thead>
    <tbody>
      {#each received.toReversed() as item (`${item.id}-${item.receiver}`)}
        <tr
          class:filler={item.filler}
          class:useful={item.useful}
          class:progression={item.progression}
          class:trap={item.trap}
        >
          <td><PlayerComponent player={players[item.receiver]} /></td>
          <td>{item.count}</td>
          <td class="name">{item.name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  table {
    display: block;
    height: 50vh;
    overflow-y: scroll;
  }

  thead {
    position: sticky;
    top: 0;
    background-color: white;
  }

  .filler .name {
    color: cyan;
  }
  .useful .name {
    color: blue;
  }
  .progression .name {
    color: purple;
  }
  .trap .name {
    color: red;
  }
</style>
