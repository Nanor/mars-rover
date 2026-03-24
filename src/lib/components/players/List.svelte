<script lang="ts">
  import type { Player } from 'archipelago.js';
  import PlayerComponent from './Player.svelte';

  const {
    players,
    connections,
    connect,
  }: { players: Record<string, Player>; connections: string[]; connect: (name: string) => void } =
    $props();
</script>

<div>
  <h2>Players</h2>
  {#each Object.values(players) as player (player.slot)}
    <div>
      <PlayerComponent {player} />
      {#if !connections.includes(player.name)}
        <button type="button" onclick={() => connect(player.name)}>Connect</button>
      {/if}
    </div>
  {/each}
</div>
