<script>
  import { auth } from "../../conf/firebase";
  import { authState } from "rxfire/auth";
  import { navigate } from "svelte-routing";
  import LoginDialog from "./LoginDialog.svelte";
  import UserDialog from "./UserDialog.svelte";

  let email;
  let password;
  let user;
  let stored;
  let isLoading = false;
  let showLogin = false;
  let showSignup = false;

  const unsubscribeUser = authState(auth).subscribe(u => (user = u));

  let loginPromise;

  function login(event) {
    console.log("login called");
    isLoading = true;
    loginPromise = auth.signInWithEmailAndPassword(
      event.detail.email,
      event.detail.password
    );
    loginPromise.then(() => {
      showLogin = false;
      isLoading = false;
    });
  }

  function signUp(event) {
    console.log("Signup called");
    isLoading = true;
    auth
      .createUserWithEmailAndPassword(event.detail.email, event.detail.password)
      .then(() => {
        showSignup = false;
        isLoading = false;
      });
  }

  let logoutPromise;
  function logout() {
    isLoading = true;
    logoutPromise = auth.signOut();
    logoutPromise.then(() => {
      isLoading = false;
      navigate("/", { replace: true });
    });
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
      <button
        class="button is-primary"
        on:click={() => {
          showSignup = true;
          console.log(showSignup);
        }}>
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
        <UserDialog
          bind:isLoading
          bind:showDialog={showLogin}
          on:signupOrLogin={login}
          dialogType="Log in" />
      {/if}
      {#if showSignup}
        <UserDialog
          bind:isLoading
          bind:showDialog={showSignup}
          on:signupOrLogin={signUp}
          dialogType="Sign up" />
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
