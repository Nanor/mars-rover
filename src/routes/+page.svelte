<script lang="ts">
  import { createClient } from '$lib/archipelago.svelte';
  import Items from '$lib/components/items/Items.svelte';
  import Log from '$lib/components/log/Log.svelte';
  import Players from '$lib/components/players/List.svelte';

  let connected = $state(false);

  const { connect, disconnect, log, players, items } = createClient();

  const handleSubmit = (
    e: SubmitEvent & {
      currentTarget: HTMLFormElement;
    }
  ) => {
    e.preventDefault();
    if (e.currentTarget) {
      const data = new FormData(e.currentTarget);

      const player = (data.get('player') as string) || 'Player1';
      const host = (data.get('host') as string) || 'localhost:38281';
      connect({ player, host });
      connected = true;
    }
  };

  const handleDisconnect = () => {
    disconnect();
    connected = false;
  };
</script>

<h1>MARS rover</h1>

<form onsubmit={handleSubmit}>
  <label>
    Player:
    <input type="text" name="player" placeholder="Player1" disabled={connected} />
  </label>
  <label>
    Host:
    <input type="text" name="host" placeholder="localhost:38281" disabled={connected} />
  </label>
  {#if connected}
    <button type="button" onclick={handleDisconnect}>Disconnect</button>
  {:else}
    <button type="submit">Connect</button>
  {/if}

  <div class="main">
    <Log {log} />
    <Players {players} />

    <div class="items">
      <Items {items} />
    </div>
  </div>
</form>

<style>
  .main {
    display: grid;
    grid-template-columns: 3fr 1fr;
  }

  .items {
    grid-column: span 2;
  }
</style>
