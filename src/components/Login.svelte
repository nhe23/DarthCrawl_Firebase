<!-- <script>
  import { auth } from "./firebase";
  import { authState } from "rxfire/auth";

  let email;
  let password;
  let user;
  let stored;

  const unsubscribeUser = authState(auth).subscribe(u => (user = u));
//   const unsubscribeStoredUser = storedUser.subscribe(value => {
//     stored = value;
//   });

  let loginPromise;

  function login(e) {
    e.preventDefault();
    loginPromise = auth.signInWithEmailAndPassword(email, password);
    loginPromise.then(() => {
    //   storedUser.set({
    //       isLoggedIn: true,
    //       email: user.email
    //   });
    });
  }

  let logoutPromise;
  function logout() {
    logoutPromise = auth.signOut();
    // storedUser.set({isLoggedIn: false, user:''})
  }
</script>

<main>
  {#if user}
    <button on:click={logout}>Logout</button>
    {#await logoutPromise}
        <p>Logging out</p>
    {/await}
  {:else}
    {#await loginPromise}
      <p>...waiting</p>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
    <form on:submit={login}>
      <input bind:value={email} type="text" id="email" name="email" />
      <br />
      <input
        bind:value={password}
        type="password"
        id="password"
        name="password" />
      <br />
      <button type="submit">Login</button>
    </form>
  {/if}
</main> -->
