<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { createClient } from '$lib/archipelago.svelte';
  import Login from '$lib/components/Login.svelte';
  import Page from '$lib/components/Page.svelte';
  import { onMount } from 'svelte';

  const client = createClient();

  const handleSubmit = (
    e: SubmitEvent & {
      currentTarget: HTMLFormElement;
    }
  ) => {
    e.preventDefault();
    if (e.currentTarget) {
      const data = new FormData(e.currentTarget);

      const player = (data.get('player') as string) || 'Player1';
      const host = (data.get('host') as string) || 'localhost:38281';
      const password = (data.get('password') as string) || '';

      goto(resolve(`/?${new URLSearchParams({ player, host, password }).toString()}`));
      client.connect({ player, host, password });
    }
  };

  onMount(() => {
    const player = page.url.searchParams.get('player') || '';
    const host = page.url.searchParams.get('host') || '';
    const password = page.url.searchParams.get('password') || '';

    if (player && host) {
      client.connect({ player, host, password });
    }
  });
</script>

<Login open={!client.connected} onsubmit={handleSubmit} />

<button
  type="button"
  onclick={() => {
    goto(resolve('/'));
    client.disconnect();
  }}>Back</button
>
<Page {client} />
