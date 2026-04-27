<script lang="ts">
  import { type createClient } from '$lib/archipelago.svelte';
  import Items from '$lib/components/items/Items.svelte';
  import Log from '$lib/components/log/Log.svelte';
  import Players from '$lib/components/players/List.svelte';
  import Hints from './hints/Hints.svelte';

  const { client }: { client: ReturnType<typeof createClient> } = $props();
  const { messages, players, items, connections, hints, addPlayer, removePlayer, lookupItemName } =
    $derived(client);

  const shownItems = $derived(items.filter((i) => connections.includes(i.receiver)));

  const shownHints = $derived(
    hints.filter(
      (h) => connections.includes(h.item.sender.name) || connections.includes(h.item.receiver.name)
    )
  );
</script>

<div class="container">
  <div class="main">
    <Log {messages} {players} {connections} />
    <Items items={shownItems} {players} {lookupItemName} />
    <Hints hints={shownHints} />
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

  .main {
    flex-grow: 1;
  }

  .players {
    width: 300px;
  }
</style>
