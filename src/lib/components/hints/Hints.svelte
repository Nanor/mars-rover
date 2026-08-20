<script lang="ts">
  import { type Hint, HintStatus, type Player } from '$lib/archipelago.svelte';

  import PlayerComponent from '../players/Player.svelte';
  import Item from '../items/Item.svelte';
  import { groupHints } from './utils';

  const { hints, connections }: { hints: Hint[]; connections: string[] } = $props();

  const groupedHints = $derived(groupHints(hints, connections));
</script>

{#snippet playerSpan(player: Player)}
  <span class="player" class:connected={connections.includes(player.name)}>
    <PlayerComponent {player} />
  </span>
{/snippet}

{#snippet status(hint: Hint)}
  ({{
    [HintStatus.found]: 'Found',
    [HintStatus.priority]: 'Priority',
    [HintStatus.no_priority]: 'No Priority',
    [HintStatus.avoid]: 'Avoid',
    [HintStatus.unspecified]: 'Unspecified',
  }[hint.status]})
{/snippet}

{#snippet section(hints: Hint[])}
  {#each hints as hint (hint.uniqueKey)}
    <tr class:found={hint.status === HintStatus.found}>
      {#if connections.includes(hint.item.sender.name)}
        <td class="arrow">→</td>
        <td>
          {@render playerSpan(hint.item.sender)}'s
          <span class="location">{hint.item.locationName}</span>
        </td>
        <td>has {@render playerSpan(hint.item.receiver)}'s <Item item={hint.item} /></td>
        <td>{@render status(hint)}</td>
      {:else}
        <td>←</td>
        <td>{@render playerSpan(hint.item.receiver)}'s <Item item={hint.item} /></td>
        <td>
          is at {@render playerSpan(hint.item.sender)}'s
          <span class="location">{hint.item.locationName}</span>
        </td>
        <td>{@render status(hint)}</td>
      {/if}
    </tr>
  {/each}
{/snippet}

<table>
  <tbody>
    {@render section(groupedHints.prioritySend)}
    <tr class="separator"><td colspan="10"></td></tr>
    {@render section(groupedHints.send)}
    <tr class="separator"><td colspan="10"></td></tr>
    {@render section(groupedHints.priorityReceive)}
    <tr class="separator"><td colspan="10"></td></tr>
    {@render section(groupedHints.receive)}
    <tr class="separator"><td colspan="10"></td></tr>
    {@render section(groupedHints.found)}
  </tbody>
</table>

<style>
  .location {
    color: var(--clr-location);
  }

  .player {
    color: var(--clr-player);
  }
  .player.connected {
    color: var(--clr-connected);
  }

  .separator td {
    border-bottom: solid 1px var(--clr-neutral-500);
  }
  .separator + .separator,
  .separator:first-child,
  .separator:last-child {
    display: none;
  }
</style>
