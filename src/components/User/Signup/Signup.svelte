<script>
  import { auth, googleProvider } from "../../../conf/firebase";
  import GoogleLogin from "../GoogleLogin.svelte";
  import { validateEmail, validatePassword } from "../../utils/helper";
  import SignUpStepEmail from "./SignupStepEmail.svelte";
  import SignUpStepPassword from "./SignupStepPassword.svelte";
  import SignUpStepVerification from "./SignupStepVerification.svelte";
  let showDialog = false;
  let isLoading = false;
  let signUpLoading = false;
  let continueDisabled = true;
  let signupError;
  let name;

  const formValues = {
    name: "",
    nameValid: null,
    email: "",
    emailValid: null,
    password: "",
    passwordValid: null
  };

  let signUpSteps = [
    {
      name: "email",
      component: SignUpStepEmail,
      nextButtonName: "Continue",
      clickFunction: () => {
        selectedIndex++;
      }
    },
    {
      name: "password",
      component: SignUpStepPassword,
      nextButtonName: "Register",
      clickFunction: () => {
        signUp();
      }
    }
  ];

  let selectedIndex = 0;

  let submitted;

  function signUp() {
    console.log("Signup called");
    signUpLoading = true;
    auth
      .createUserWithEmailAndPassword(formValues.email, formValues.password)
      .then(() => {
        auth.currentUser
          .updateProfile({
            displayName: formValues.name
          })
          .then(() => {
            console.log("Created user with name");
            signUpLoading = false;
          })
          .catch(() => {
            signUpLoading = false;
            console.log("Could not create user");
          });
      });
  }
</script>

<style>
  .backButton {
    background-color: transparent;
    border: 0;
    padding-left: 0px !important;
  }
  .footerContainer {
    display: flex;
    align-items: center;
  }

  .modal-card-head {
    border-bottom: 0px;
    flex-flow: row-reverse;
    justify-content: space-between;
    padding-bottom: 10px;
  }

  .modal-card-body {
    padding-top: 0px;
  }

  .modal-card {
    max-width: 440px;
    min-height: 400px;
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
          class:is-loading={signUpLoading}
          on:click={signUpSteps[selectedIndex].clickFunction}>
          {signUpSteps[selectedIndex].nextButtonName}
        </button>
        {#if selectedIndex > 0}
          <div
            class="button is-rounded backButton"
            aria-label="continue"
            on:click={() => {
              selectedIndex--;
            }}>
            <i class="fas fa-arrow-left has-text-white" />
          </div>
        {/if}
      </header>
      <section class="modal-card-body">
        <svelte:component
          this={signUpSteps[selectedIndex].component}
          bind:continueDisabled
          {formValues} />
      </section>

      <footer class="modal-card-foot">
        <div class="footerContainer">
          <span>Or register via</span>
          <GoogleLogin />
        </div>
      </footer>
    </div>
  </div>

</div>
