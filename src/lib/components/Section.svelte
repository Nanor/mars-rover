<script lang="ts">
  import type { Snippet } from 'svelte';

  const { title, children }: { title: string; children: Snippet } = $props();
</script>

<details open>
  <summary>{title}</summary>
  {@render children()}
</details>

<style>
  details {
    overflow-y: scroll;
    min-height: 25px;
    max-height: max-content;
  }

  details[open] {
    flex-basis: 100vh;
  }

  summary {
    position: sticky;
    top: 0;

    width: 100%;
    padding: 0.2em;

    text-transform: uppercase;
    color: var(--clr-neutral-100);
    background-color: var(--clr-neutral-500);
  }
</style>
