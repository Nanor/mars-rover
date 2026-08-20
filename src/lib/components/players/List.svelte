<script lang="ts">
  import type { Player } from '$lib/archipelago.svelte';
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
  let open = $state(true);

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

<details open>
  <summary>Players</summary>
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

  <div class="disconnected">
    {#each disconnectedPlayers as player (player.slot)}
      <div>
        <button type="button" onclick={() => addPlayer(player.name)} aria-label="Connect">
          +
        </button>
        <PlayerComponent {player} />
      </div>
    {/each}
  </div>
</details>

<style>
  details {
    flex-shrink: 0;

    display: flex;
    gap: 2px;
    width: 22px;
    overflow: clip;
  }

  details[open] {
    width: max-content;
  }

  summary {
    width: 22px;
    height: 100%;
    padding-block: 0.125em;
    padding-inline: 0.25em;

    color: var(--clr-neutral-100);
    background-color: rgb(150, 150, 150);

    flex-shrink: 0;
    flex-grow: 0;
    writing-mode: sideways-lr;
    text-align: end;

    text-transform: uppercase;
    margin: 0;
    display: inline;
    font-weight: 500;
  }

  .separator {
    width: 100%;
    border-bottom: solid 1px grey;
    margin-block: 8px;
  }

  .disconnected {
    flex-shrink: 1;
    overflow-y: scroll;
    width: max-content;
  }
</style>
