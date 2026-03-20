<script lang="ts">
  import { type Player } from '$lib/archipelago.svelte';

  const { players, connect }: { players: Record<string, Player>; connect: (name: string) => void } =
    $props();
</script>

<div>
  <h2>Players</h2>
  {#each Object.values(players) as player (player.id)}
    <div>
      {player.name} ({player.game})
    </div>
    {#if !player.connected}
      <button type="button" onclick={() => connect(player.name)}>Connect</button>{/if}
  {/each}
</div>
