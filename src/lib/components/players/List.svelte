<script lang="ts">
  import { type Player } from '$lib/archipelago.svelte';

  const { players }: { players: Player[] } = $props();
</script>

<div>
  <h2>Players</h2>
  {#each players as player (player.id)}
    <div>
      {player.name} ({player.game})
    </div>
  {/each}
</div>
