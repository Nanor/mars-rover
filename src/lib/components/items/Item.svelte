<script lang="ts">
  type Item = {
    name: string;
    filler: boolean;
    useful: boolean;
    progression: boolean;
    trap: boolean;
    groups?: string[];
  };

  const { item, groups }: { item: Item; groups: string[] } = $props();

  const itemClass = $derived(
    [
      ...(item.trap ? ['trap'] : []),
      ...(item.progression ? ['progression'] : []),
      ...(item.useful ? ['useful'] : []),
      ...(item.filler ? ['filler'] : []),
    ].join(', ')
  );
</script>

<span>
  <span
    class:filler={item.filler}
    class:useful={item.useful}
    class:progression={item.progression}
    class:trap={item.trap}
    title={`Item class: ${itemClass}`}
  >
    {item.name}
  </span>

  {#each item.groups as group (group)}
    <span class="group" style="--group-color:var(--clr-group-{groups.indexOf(group) % 10})"
      >{group}</span
    >
  {/each}
</span>

<style>
  .filler {
    color: var(--clr-filler);
  }
  .useful {
    color: var(--clr-useful);
  }
  .progression {
    color: var(--clr-progression);
  }
  .trap {
    color: var(--clr-trap);
  }

  .group {
    color: var(--clr-neutral-100);
    background-color: var(--group-color);
    border-radius: 100vh;
    padding-block: 0.2em;
    padding-inline: 0.4em;
    font-size: 0.7em;
    text-transform: lowercase;
  }
</style>
