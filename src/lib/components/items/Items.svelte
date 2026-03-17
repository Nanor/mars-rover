<script lang="ts">
  import { type Item } from 'archipelago.js';

  const { items }: { items: Item[] } = $props();
</script>

<div>
  <h2>Items</h2>

  {#each items as item (`${item.id}-${item.locationId}`)}
    <div>{item.name} {item.sender} -> {item.receiver}</div>
  {/each}
</div>
