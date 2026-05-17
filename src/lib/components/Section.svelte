<script lang="ts">
  import type { Snippet } from 'svelte';

  const { title, children }: { title: string; children: Snippet } = $props();

  let open = $state(true);
</script>

<button type="button" onclick={() => (open = !open)}>
  {#if open}▼{:else}▶{/if}

  <h2>{title}</h2>
</button>
<div class:open>
  {@render children()}
</div>

<style>
  button {
    width: 100%;
    text-align: left;
    padding: 0.2em;
    border: solid 1px var(--clr-neutral-100);

    color: var(--clr-neutral-100);
    background-color: var(--clr-neutral-500);

    flex-grow: 0;
    flex-basis: 1lh;
  }

  h2 {
    font-size: 1.25em;
    text-transform: uppercase;
    margin: 0;
    display: inline;
    font-weight: 500;
  }

  div {
    overflow: hidden;
    position: relative;

    height: 0;
    transition:
      height 0.25s,
      flex-basis 0.25s;
  }

  div.open {
    flex-basis: 100vh;
    overflow: scroll;
    height: max-content;
  }
</style>
