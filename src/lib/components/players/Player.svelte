<script lang="ts">
  import type { Player } from '$lib/archipelago.svelte';

  const { player }: { player: Player } = $props();
</script>

{#if player}
  <span title={`Game: ${player.game}`}>{player.alias}</span>
{/if}
