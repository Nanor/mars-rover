<script lang="ts">
  import type { Hint } from 'archipelago.js';

  import PlayerComponent from '../players/Player.svelte';
  import Item from '../items/Item.svelte';

  const { hints }: { hints: Hint[] } = $props();
</script>

<div>
  <div>
    <h2>Hints</h2>
  </div>

  <table>
    <thead>
      <tr>
        <th>Receiver</th>
        <th>Item</th>
        <th>Sender</th>
        <th>Location</th>
        <th>Found</th>
      </tr>
    </thead>
    <tbody>
      {#each hints as hint (`${hint.item.locationId}-${hint.item.sender.slot}`)}
        <tr>
          <td><PlayerComponent player={hint.item.receiver} /></td>
          <td><Item item={hint.item} /></td>
          <td><PlayerComponent player={hint.item.sender} /></td>
          <td>{hint.item.locationName}</td>
          <td>{hint.found ? '✔️' : 'X'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  table {
    display: block;
    height: 20vh;
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
