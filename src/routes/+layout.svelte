<script lang="ts">
  import favicon from '$lib/assets/favicon.png';

  let { children } = $props();
</script>

<svelte:head>
  <title>MARS Rover</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<h1>MARS Rover</h1>

{@render children()}
