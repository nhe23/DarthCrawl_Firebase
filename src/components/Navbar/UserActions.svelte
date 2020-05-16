<script>
  import Signup from "../User/Signup.svelte";

  import { auth, googleProvider } from "../../conf/firebase";
  import { authState } from "rxfire/auth";
  import { navigate } from "../Router";
  import Login from "../User/Login.svelte";
  import ProfilePicture from "../User/ProfilePicture.svelte";
  import ProfileModal from "../User/ProfileModal.svelte";

  let email;
  let password;
  let user;
  let stored;
  let isLoading = false;
  let showLogin = false;
  let showSignup = false;

  const unsubscribeUser = authState(auth).subscribe((u) => (user = u));

  let loginPromise;
  let showProfileMenu = false;

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
</script>

<style>

</style>

<main>

  {#if user}
    <ProfileModal {user} />
  {:else}
    <div class="buttons">
      <Login />
      <button
        class="button is-primary"
        on:click={() => {
          showSignup = true;
          console.log(showSignup);
        }}>
        <strong>Register</strong>
      </button>

      {#if showSignup}
        <Signup
          bind:isLoading
          bind:showDialog={showSignup}
          on:signupOrLogin={signUp} />
      {/if}
    </div>
  {/if}

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
