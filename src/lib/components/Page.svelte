<script lang="ts">
  import { type createClient } from '$lib/archipelago.svelte';
  import Items from '$lib/components/items/Items.svelte';
  import Log from '$lib/components/log/Log.svelte';
  import Players from '$lib/components/players/List.svelte';

  const { client }: { client: ReturnType<typeof createClient> } = $props();
  const { messages, players, items, connections, addPlayer, removePlayer } = $derived(client);

  const shownItems = $derived(items.filter((i) => connections.includes(i.receiver)));
</script>

<div class="container">
  <div class="main">
    <Log {messages} {players} {connections} />
    <Items items={shownItems} {players} />
  </div>
  <div class="players">
    <Players {players} {connections} {addPlayer} {removePlayer} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
  }
  .players {
    width: 300px;
  }
</style>
