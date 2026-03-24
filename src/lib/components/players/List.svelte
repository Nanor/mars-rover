<script lang="ts">
  import type { Player } from 'archipelago.js';
  import PlayerComponent from './Player.svelte';

  const {
    players,
    connections,
    addPlayer,
    removePlayer,
  }: {
    players: Record<string, Player>;
    connections: string[];
    addPlayer: (name: string) => void;
    removePlayer: (name: string) => void;
  } = $props();
</script>

<div>
  <h2>Players</h2>
  {#each Object.values(players) as player (player.slot)}
    <div>
      <PlayerComponent {player} />
      {#if connections.includes(player.name)}
        <button
          type="button"
          disabled={connections.length === 1}
          onclick={() => removePlayer(player.name)}>Disconnect</button
        >
      {:else}
        <button type="button" onclick={() => addPlayer(player.name)}>Connect</button>
      {/if}
    </div>
  {/each}
</div>
