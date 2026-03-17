<script lang="ts">
  import { type MessageNode } from 'archipelago.js';
  import Message from './Message.svelte';

  const { log }: { log: MessageNode[][] } = $props();
</script>

<div>
  <h2>Log</h2>
  <div class="log">
    {#each log as message, i (i)}
      <Message parts={message} />
    {/each}
  </div>
</div>

<style>
  .log {
    height: 30lh;
    overflow-y: scroll;

    border: solid black 1px;
  }
</style>
