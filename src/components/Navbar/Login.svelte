<script>
  import { auth } from "../../conf/firebase";
  import { authState } from "rxfire/auth";
  import LoginDialog from './LoginDialog.svelte'

  let email;
  let password;
  let user;
  let stored;
  let isLoading = false;
  let showLogin = false;

  const unsubscribeUser = authState(auth).subscribe(u => (user = u));

  let loginPromise;

  function login(event) {
    console.log("login called");
    isLoading = true;
    loginPromise = auth.signInWithEmailAndPassword(event.detail.email, event.detail.password);
    loginPromise.then(() => {
      showLogin=false;
      isLoading = false;
    });
  }


  let logoutPromise;
  function logout() {
    isLoading = true;
    logoutPromise = auth.signOut();
    logoutPromise.then(() => {
      isLoading = false;
    });
    // storedUser.set({isLoggedIn: false, user:''})
  }
</script>

<main>
  <div class="buttons">
    {#if user}
      <button
        class="button is-light"
        class:is-loading={isLoading}
        on:click={logout}>
        Log out
      </button>
    {:else}
      <button class="button is-primary">
        <strong>Sign up</strong>
      </button>
      <button
        class="button is-light"
        on:click={() => {
          
          showLogin = true;
          console.log(showLogin);
        }}>
        Log in
      </button>
      {#if showLogin}
        <LoginDialog bind:isLoading={isLoading} bind:showLogin={showLogin} on:login={login}/>
      {/if}
    {/if}
  </div>

  <!-- {#await loginPromise}
      <p>...waiting</p>
       error}
      <p style="color: red">{error.message}</p>
    {:then} -->

  <!-- <form on:submit={login}>
    <input bind:value={email} type="text" id="email" name="email" />
    <br />
    <input
      bind:value={password}
      type="password"
      id="password"
      name="password" />
    <br />
    <button type="submit">Login</button>
  </form> -->

</main>
