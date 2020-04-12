<script>
  import { createEventDispatcher } from "svelte";
  let email;
  let password;
  let passwordValid;
  let emailValid;
  let timer;
  const dispatch = createEventDispatcher();

  export let showLogin;
  export let isLoading;
  export let dialogType;

  function validatePassword() {
    if (password && password.length >= 6) {
      passwordValid = true;
      return;
    }
    passwordValid = false;
  }
  const debounce = v => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      v();
    }, 750);
  };
  function validateEmail() {
    console.log(email);
    if (
      email &&
      email.length >= 5 &&
      email.includes("@") &&
      email.includes(".")
    ) {
      emailValid = true;
      return;
    }
    emailValid = false;
  }
  function login() {
    dispatch("login", {email, password});
  }
</script>

<main>
  <div class="modal is-active" class:is-active={showLogin}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{dialogType}</p>
        <button
          class="delete"
          aria-label="close"
          on:click={() => (showLogin = false)} />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              type="email"
              placeholder="Email input"
              bind:value={email}
              on:input={() => {
                debounce(validateEmail);
              }} />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
          </div>
          {#if email && emailValid !== undefined && !emailValid}
            <p class="help is-danger">This email is invalid</p>
          {/if}
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              type="password"
              placeholder="Password"
              bind:value={password}
              on:input={() => {
                debounce(validatePassword);
              }} />
            <span class="icon is-small is-left">
              <i class="fas fa-key" />
            </span>
          </div>
          {#if password && passwordValid !== undefined && !passwordValid}
            <p class="help is-danger">This password is invalid</p>
          {/if}
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-primary"
          disabled={!emailValid || !passwordValid}
          on:click={login}
          class:is-loading={isLoading}>
          {dialogType}
        </button>
        <button class="button" on:click={() => (showLogin = false)}>
          Cancel
        </button>
      </footer>
    </div>
  </div>
</main>
