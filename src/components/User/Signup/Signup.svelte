<script>
  import { auth, googleProvider } from "../../../conf/firebase";
  import GoogleLogin from "../GoogleLogin.svelte";
  import { validateEmail, validatePassword } from "../../utils/helper";
  import SignUpStepEmail from "./SignupStepEmail.svelte";
  import SignUpStepPassword from "./SignupStepPassword.svelte";
  import SignUpStepVerification from "./SignupStepVerification.svelte";
  let showDialog = false;
  let isLoading = false;
  let continueDisabled=true;
  let email;
  let password;
  let signupError;
  let name;

  const formValues = {
    name: "",
    nameValie: null,
    email: "",
    emailValid: null,
    password: "",
    passwordValid: null
  };

  let signUpSteps = [
    { name: "email", component: SignUpStepEmail},
    { name: "password", component: SignUpStepPassword},
    { name: "verification", component: SignUpStepVerification}
  ];

  let selectedIndex = 0;

  let submitted;

  function signUp(event) {
    console.log("Signup called");
    isLoading = true;
    auth.createUserWithEmailAndPassword(email, password).then(() => {
      showDialog = false;
      isLoading = false;
    });
  }
</script>

<style>
  .footerContainer {
    display: flex;
    align-items: center;
  }

  .modal-card-head {
    border-bottom: 0px;
    flex-flow: row-reverse;
    justify-content: space-between;
    padding-bottom: 0px;
  }

  .modal-card-body {
    padding-top: 0px;
  }

  .modal-card {
    max-width: 440px;
  }
</style>

<div>
  <button
    class="button is-primary is-rounded"
    on:click={() => {
      showDialog = true;
    }}>
    <strong>Register</strong>
  </button>
  <div class="modal is-active" class:is-active={showDialog}>
    <div
      class="modal-background"
      on:click={() => {
        showDialog = false;
      }} />
    <div class="modal-card">
      <header class="modal-card-head">
        <button
          class="button is-rounded"
          aria-label="continue"
          disabled={continueDisabled}
          on:click={() => {
            if (selectedIndex < signUpSteps.length - 1) selectedIndex++;
            else showDialog = false;
          }}>
          {selectedIndex < signUpSteps.length - 1 ? 'Continue' : 'Done'}
        </button>
        {#if selectedIndex > 0}
          <div
            class="button is-rounded"
            aria-label="continue"
            on:click={() => {
              selectedIndex--;
            }}>
            <i class="fas fa-arrow-left" />
          </div>
        {/if}
      </header>
      <form
        id="register"
        on:submit={e => {
          e.preventDefault();
          submitted = true;
          if (emailValid && passwordValid) signUp();
        }}>
        <section class="modal-card-body">
          <svelte:component this={signUpSteps[selectedIndex].component} bind:continueDisabled={continueDisabled} {formValues}/>
        </section>

        <footer class="modal-card-foot">
          <div class="footerContainer">
            <span>Or register via</span>
            <GoogleLogin />
          </div>
        </footer>
      </form>
    </div>
  </div>

</div>
