<script lang="ts">
  import { type MessageNode } from 'archipelago.js';
  import Message from './Message.svelte';
  import { onMount } from 'svelte';

  const { messages }: { messages: Record<string, MessageNode[][]> } = $props();

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
  {#each Object.keys(messages) as player (player)}
    {#if activePlayer === player}
      <span>{player}</span>
    {:else}
      <button type="button" onclick={() => (activePlayer = player)}>{player}</button>
    {/if}
  {/each}
  <div class="log" bind:this={element}>
    {#each messages[activePlayer] as message, i (i)}
      <Message parts={message} />
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
