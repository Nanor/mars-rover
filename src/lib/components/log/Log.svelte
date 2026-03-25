<script lang="ts">
  import type { Player, MessageNode } from 'archipelago.js';
  import Message from './Message.svelte';
  import PlayerComponent from '../players/Player.svelte';

  const {
    messages,
    players,
    connections,
  }: {
    messages: Record<string, MessageNode[][]>;
    players: Record<string, Player>;
    connections: string[];
  } = $props();

  let activePlayer = $state('');

  $effect(() => {
    if (!activePlayer || !messages[activePlayer]) {
      activePlayer = Object.keys(messages)[0];
    }
  });

  let element = $state<HTMLDivElement>();

  $effect(() => {
    if (messages[activePlayer]?.length && element) {
      element.scrollTo({ top: element.scrollHeight });
    }
  });
</script>

<div>
  <h2>Log</h2>
  {#each Object.keys(messages) as name (name)}
    {#if activePlayer === name}
      <PlayerComponent player={players[name]} />
    {:else}
      <button type="button" onclick={() => (activePlayer = name)}>
        <PlayerComponent player={players[name]} />
      </button>
    {/if}
  {/each}
  <div class="log" bind:this={element}>
    {#each messages[activePlayer] as message, i (i)}
      <Message parts={message} {connections} />
    {/each}
  </div>
</div>

<style>
  .log {
    height: 15lh;
    overflow-y: scroll;

    border: solid black 1px;
  }
</style>
