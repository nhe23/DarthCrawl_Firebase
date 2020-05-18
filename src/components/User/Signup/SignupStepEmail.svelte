<script>
  import { onMount } from "svelte";
  import { validateEmail } from "../../utils/helper";
  export let formValues;
  export let continueDisabled;

  let timer;

  function setContinueDisabled() {
    continueDisabled = !formValues.nameValid || !formValues.emailValid;
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
</style>

<div class="modal-card-title has-text-white">Create your account</div>
<div class="field">
  <div class="control has-icons-left">
    <input
      class="input"
      type="text"
      placeholder="Name"
      bind:value={formValues.name}
      on:input={() => {
        formValues.nameValid = formValues.name !== '';
        setContinueDisabled();
      }} />
    <span class="icon is-small is-left">
      <i class="fas fa-user" />
    </span>
  </div>
</div>

<div class="field">
  <div class="control has-icons-left">
    <input
      class="input"
      type="email"
      placeholder="Email"
      bind:value={formValues.email}
      on:input={() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          formValues.emailValid = validateEmail(formValues.email);
          setContinueDisabled();
        }, 750);
      }} />
    <span class="icon is-small is-left">
      <i class="fas fa-envelope" />
    </span>
  </div>
  {#if formValues.email && formValues.emailValid !== null && !formValues.emailValid}
    <p class="help is-danger">This email is invalid</p>
  {/if}
</div>
