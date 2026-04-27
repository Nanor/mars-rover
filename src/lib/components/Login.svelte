<script lang="ts">
  const {
    onsubmit,
    open,
  }: {
    onsubmit: (
      e: SubmitEvent & {
        currentTarget: HTMLFormElement;
      }
    ) => void;
    open: boolean;
  } = $props();

  let dialog = $state<HTMLDialogElement>();

  $effect(() => {
    if (open) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });
</script>

<dialog bind:this={dialog}>
  <form {onsubmit} method="dialog">
    <label>
      <span>Player:</span>
      <input type="text" name="player" placeholder="Player1" autocomplete="username" />
    </label>
    <label>
      <span>Host:</span>
      <input type="text" name="host" placeholder="localhost:38281" autocomplete="url" />
    </label>
    <label>
      <span>Password:</span>
      <input
        type="password"
        name="password"
        placeholder="Password"
        autocomplete="current-password"
      />
    </label>
    <button type="submit">Connect</button>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: oklab(0% 0 0 / 0.1);
  }

  form > * {
    display: block;
  }

  form span {
    display: inline-block;
    width: 75px;
  }

  input {
    width: 100%;
    min-width: 250px;
    font-size: 1.25em;
    margin-block-end: 0.5em;
  }

  button {
    width: 100%;
    font-size: 1.25em;
    cursor: pointer;
  }
</style>
