<script lang="ts">
  import { createClient } from '$lib/archipelago.svelte';
  import Page from '$lib/components/Page.svelte';

  const client = createClient();

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
      const password = (data.get('password') as string) || '';
      client.connect({ player, host, password });
    }
  };
</script>

<h1>MARS rover</h1>

{#if !client.connected}
  <form onsubmit={handleSubmit}>
    <label>
      <span>Player:</span>
      <input type="text" name="player" placeholder="Player1" />
    </label>
    <label>
      <span>Host:</span>
      <input type="text" name="host" placeholder="localhost:38281" />
    </label>
    <label>
      <span>Password:</span>
      <input type="password" name="password" placeholder="Password" />
    </label>
    <button type="submit">Connect</button>
  </form>
{:else}
  <button type="button" onclick={() => client.disconnect()}>Back</button>
  <Page {client} />
{/if}

<style>
  form > * {
    display: block;
  }

  form span {
    display: inline-block;
    width: 75px;
  }
</style>
