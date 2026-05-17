<script lang="ts">
  import { HintStatus, type Hint } from '$lib/archipelago.svelte';

  import PlayerComponent from '../players/Player.svelte';
  import Item from '../items/Item.svelte';

  const { hints }: { hints: Hint[] } = $props();

  const sortedHints = $derived(
    hints.toSorted(
      (a, b) =>
        (b.status === HintStatus.found ? -10 : b.status) -
        (a.status === HintStatus.found ? -10 : a.status)
    )
  );
</script>

<table>
  <thead>
    <tr>
      <th>Receiver</th>
      <th>Item</th>
      <th>Sender</th>
      <th>Location</th>
      <th>Entrance</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#each sortedHints as hint (`${hint.item.locationId}-${hint.item.sender.slot}`)}
      <tr class:found={hint.status === HintStatus.found}>
        <td><PlayerComponent player={hint.item.receiver} /></td>
        <td><Item item={hint.item} /></td>
        <td><PlayerComponent player={hint.item.sender} /></td>
        <td>{hint.item.locationName}</td>
        <td>{hint.entrance}</td>
        <td>
          {{
            [HintStatus.found]: 'Found',
            [HintStatus.priority]: 'Priority',
            [HintStatus.no_priority]: 'No Priority',
            [HintStatus.avoid]: 'Avoid',
            [HintStatus.unspecified]: 'Unspecified',
          }[hint.status]}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  thead {
    position: sticky;
    top: 0;
    background-color: var(--clr-neutral-100);
  }

  .found {
    text-decoration: line-through;
  }
</style>
