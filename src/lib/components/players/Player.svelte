<script lang="ts">
  import type { Player } from 'archipelago.js';

  const { player }: { player: Player } = $props();
</script>

{#if player}
  <span title={`Game: ${player.game}`}>{player.alias}</span>
{/if}
