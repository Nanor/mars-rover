<script lang="ts">
  import { type createClient } from '$lib/archipelago.svelte';
  import Items from '$lib/components/items/Items.svelte';
  import Log from '$lib/components/log/Log.svelte';
  import Players from '$lib/components/players/List.svelte';
  import Hints from './hints/Hints.svelte';
  import Section from './Section.svelte';

  const { client }: { client: ReturnType<typeof createClient> } = $props();
  const {
    messages,
    players,
    items,
    connections,
    hints,
    groups,
    addPlayer,
    removePlayer,
    lookupItemName,
  } = $derived(client);

  const shownItems = $derived(items.filter((i) => connections.includes(i.receiver)));

  const shownHints = $derived(
    hints.filter(
      (h) => connections.includes(h.item.sender.name) || connections.includes(h.item.receiver.name)
    )
  );
</script>

<div class="container">
  <div class="main">
    <Section title="Messages">
      <Log {messages} {players} {connections} />
    </Section>
    <Section title="Items">
      <Items items={shownItems} {players} {lookupItemName} {groups} />
    </Section>
    <Section title="Hints">
      <Hints hints={shownHints} {connections} />
    </Section>
  </div>
  <Players {players} {connections} {addPlayer} {removePlayer} />
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
  }

  .main {
    flex-grow: 1;
    height: calc(100dvh - 50px);

    display: flex;
    flex-direction: column;
    align-content: flex-start;
  }
</style>
