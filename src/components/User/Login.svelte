<script>
  import { auth, googleProvider } from "../../conf/firebase";
  import { validateEmail, validatePassword } from "../utils/helper";
  import GoogleLogin from "./GoogleLogin.svelte";
  let email;
  let password;
  let submitted = false;

  $: passwordValid = validatePassword(password);
  let loginError;
  $: emailValid = validateEmail(email);

  let showDialog;
  let isLoading = false;

  function resetLoginError() {
    loginError = null
  }

  function loginWithEmail() {
    loginError = null;
    console.log("login called");
    isLoading = true;
    const loginPromise = auth.signInWithEmailAndPassword(email, password);
    loginPromise
      .then(() => {
        isLoading = false;
        showDialog = false;
      })
      .catch((err) => {
        isLoading = false;
        loginError = err.message;
      });
  }

  function loginWithGoogle() {
    auth
      .signInWithPopup(googleProvider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(result);
        // ...
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
</script>

<style>
  .footerContainer {
    display: flex;
    align-items: center;
  }

  .modal-card {
    max-width: 440px;
  }

  .signinButton {
    margin-bottom: 0 !important;
  }
</style>

<div>
  <button
    class="button is-light"
    on:click={() => {
      showDialog = true;
    }}>
    Sign in
  </button>
  <div class="modal is-active" class:is-active={showDialog}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <span class="modal-card-title has-text-white">Log in</span>

        <button
          class="delete"
          aria-label="close"
          on:click={() => (showDialog = false)} />
      </header>
      <form
        id="login"
        on:submit={(e) => {
          e.preventDefault();
          submitted = true;
          if (emailValid && passwordValid) loginWithEmail();
        }}>
        <section class="modal-card-body">

          <div class="field">
            <label class="label has-text-white">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                type="email"
                placeholder="Email input"
                autocomplete="username"
                bind:value={email}
                on:input={resetLoginError} />
              <span class="icon is-small is-left">
                <i class="fas fa-envelope" />
              </span>
            </div>
            {#if submitted && email && emailValid !== undefined && !emailValid}
              <p class="help is-danger">This email is invalid</p>
            {/if}
          </div>
          <div class="field">
            <label class="label has-text-white">Password</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
                bind:value={password} 
                on:input={resetLoginError}/>
              <span class="icon is-small is-left">
                <i class="fas fa-key" />
              </span>
            </div>
            {#if submitted && password && passwordValid !== undefined && !passwordValid}
              <p class="help is-danger">This password is invalid</p>
            {/if}
          </div>
          {#if loginError}
            <p class="help is-danger">{loginError}</p>
          {/if}
        </section>
        <footer class="modal-card-foot">
          <div class="footerContainer">
            <button
              class="button is-primary signinButton"
              type="submit"
              disabled={!email || !password}
              class:is-loading={isLoading}>
              Sign in
            </button>
            <span>or sign in with</span>
            <GoogleLogin login={loginWithGoogle} />
          </div>
        </footer>
      </form>
    </div>
  </div>
</div>
