<script lang="ts">
  import type { Player, MessageNode } from '$lib/archipelago.svelte';
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

<div class="header">
  {#each Object.keys(messages) as name (name)}
    {#if activePlayer === name}
      <PlayerComponent player={players[name]} />
    {:else}
      <button type="button" onclick={() => (activePlayer = name)}>
        <PlayerComponent player={players[name]} />
      </button>
    {/if}
  {/each}
</div>
<div class="log" bind:this={element}>
  {#each messages[activePlayer] as message, i (i)}
    <Message parts={message} {connections} />
  {/each}
</div>

<style>
  .header {
    position: sticky;
    top: 24px;
    background-color: var(--clr-neutral-100);
  }
</style>
