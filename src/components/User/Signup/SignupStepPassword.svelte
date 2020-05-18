<script>
  import { validatePassword } from "../../utils/helper";
  import { onMount } from "svelte";
  export let formValues;
  export let continueDisabled;
  let timer;

  let showPassword = false;

  function setContinueDisabled() {
    continueDisabled = !formValues.passwordValid;
  }
  function toggleShowPassword() {
    showPassword = !showPassword;
  }

  onMount(() => {
    setContinueDisabled();
  });
</script>

<style>
  .icon {
    pointer-events: initial !important;
    cursor: pointer;
  }
  .modal-card-title {
    margin-bottom: 20px;
  }
  .field {
    margin-bottom: 20px !important;
  }
</style>

<div>
  <div class="modal-card-title has-text-white">Choose your password</div>
  <div class="field">
    <div class="control has-icons-left has-icons-right">
      {#if showPassword}
        <input
          class="input"
          type="text"
          placeholder="Password"
          autocomplete="new-password"
          bind:value={formValues.password}
          on:input={() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              formValues.passwordValid = validatePassword(formValues.password);
              setContinueDisabled();
            }, 750);
          }} />
      {:else}
        <input
          class="input"
          type="password"
          placeholder="Password"
          autocomplete="new-password"
          bind:value={formValues.password}
          on:input={() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              formValues.passwordValid = validatePassword(formValues.password);
              setContinueDisabled();
            }, 750);
          }} />
      {/if}
      <span class="icon is-small is-left">
        <i class="fas fa-key" />
      </span>
      {#if showPassword}
        <span class="icon is-small is-right" on:click={toggleShowPassword}>
          <i class="fas fa-eye" />
        </span>
      {:else}
        <span class="icon is-small is-right" on:click={toggleShowPassword}>
          <i class="fas fa-eye-slash" />
        </span>
      {/if}
    </div>
    {#if formValues.password && formValues.passwordValid !== null && !formValues.passwordValid}
      <p class="help is-danger">This password is invalid</p>
    {/if}

  </div>
  <span>
    By registering you accept the terms and conditions privacy policy of
    DarthCrawl.
  </span>
</div>
