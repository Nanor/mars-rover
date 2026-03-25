<script lang="ts">
  type Item = {
    name: string;
    filler: boolean;
    useful: boolean;
    progression: boolean;
    trap: boolean;
  };

  const { item }: { item: Item } = $props();

  const itemClass = $derived(
    [
      ...(item.trap ? ['trap'] : []),
      ...(item.progression ? ['progression'] : []),
      ...(item.useful ? ['useful'] : []),
      ...(item.filler ? ['filler'] : []),
    ].join(', ')
  );
</script>

<span
  class:filler={item.filler}
  class:useful={item.useful}
  class:progression={item.progression}
  class:trap={item.trap}
  title={`Item class: ${itemClass}`}
>
  {item.name}
</span>

<style>
  .filler {
    color: cyan;
  }
  .useful {
    color: blue;
  }
  .progression {
    color: purple;
  }
  .trap {
    color: red;
  }
</style>
