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

  let searchValue = $state('');

  const connectedPlayers = $derived(
    Object.values(players).filter((p) => connections.includes(p.name))
  );
  const disconnectedPlayers = $derived(
    Object.values(players).filter(
      (p) =>
        !connections.includes(p.name) &&
        (!searchValue ||
          p.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
          p.alias.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
    )
  );
</script>

<div>
  <h2>Players</h2>
  {#each connectedPlayers as player (player.slot)}
    <div>
      <button
        type="button"
        disabled={connections.length === 1}
        onclick={() => removePlayer(player.name)}
        aria-label="Disconnect"
      >
        -
      </button>
      <PlayerComponent {player} />
    </div>
  {/each}
  <div class="separator"></div>

  <input type="text" placeholder="Search players" bind:value={searchValue} />

  {#each disconnectedPlayers as player (player.slot)}
    <div>
      <button type="button" onclick={() => addPlayer(player.name)} aria-label="Connect"> + </button>
      <PlayerComponent {player} />
    </div>
  {/each}
</div>

<style>
  .separator {
    width: 100%;
    border-bottom: solid 1px grey;
    margin-block: 8px;
  }
</style>
