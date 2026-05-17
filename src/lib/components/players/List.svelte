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

<div class="sidebar">
  <button class="expander" onclick={() => (open = !open)}>
    <h2>Players</h2>
    {#if open}▼{:else}◀{/if}
  </button>
  <div class="content" class:open>
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
  </div>
</div>

<style>
  .sidebar {
    display: flex;
    flex-shrink: 0;
  }

  .expander {
    width: 100%;
    text-align: left;
    border: solid 1px var(--clr-neutral-100);
    padding-inline-start: 0.125em;
    padding-block-start: 0.25em;

    color: var(--clr-neutral-100);
    background-color: rgb(150, 150, 150);

    flex-grow: 0;
    flex-basis: 1.75lh;
    writing-mode: sideways-lr;
    text-align: end;
  }

  h2 {
    font-size: 1.25em;
    text-transform: uppercase;
    margin: 0;
    display: inline;
    font-weight: 500;
  }

  .content {
    transition: width 0.25s;
    width: max-content;

    display: flex;
    flex-direction: column;
    height: calc(100vh - 2.5lh);
  }

  .content:not(.open) {
    width: 0;
    overflow: hidden;
  }

  .separator {
    width: 100%;
    border-bottom: solid 1px grey;
    margin-block: 8px;
  }

  .disconnected {
    flex-shrink: 1;
    overflow-y: scroll;
  }
</style>
