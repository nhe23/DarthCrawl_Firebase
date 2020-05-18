<script>
  import ProfilePicture from "./ProfilePicture.svelte";
  import { auth, googleProvider } from "../../conf/firebase";
  import { navigate } from "../Router";
  export let user;
  let showProfileMenu = false;
  let isLoading = false;

  function logout() {
    isLoading = true;
    const logoutPromise = auth.signOut();
    logoutPromise.then(() => {
      isLoading = false;
      showProfileMenu = false;
      navigate("/", { replace: true });
    });
  }
</script>

<style>
  .modal-card {
    margin-right: 10px !important;
    margin-top: 10px;
    width: 320px;
  }
  .modal {
    justify-content: flex-start;
    top: 4em;
  }

  .modal-card-head {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .modal-card-foot {
    display: flex;
    justify-content: center;
  }

  .icon {
    border-radius: 50%;
  }

  .settings {
    border-radius: 1em;
    display: flex;
    align-items: center;
    width: fit-content;
    padding-right: 10px;
  }
  .settingsContainer {
    cursor: pointer;
    display: flex;
    justify-content: center;
  }

  .settings:hover {
    background-color: darkgray;
  }

  .modal-background {
    background-color: transparent;
  }
</style>

<ProfilePicture
  on:click={() => {
    showProfileMenu = !showProfileMenu;
  }} />
<div class="modal" class:is-active={showProfileMenu}>
  <div
    class="modal-background"
    on:click={() => {
      showProfileMenu = false;
    }} />
  <div class="modal-card">
    <header class="modal-card-head">
      <ProfilePicture size="L" hasCameraIcon="true" />
      {#if user.displayName}
        <span class="has-text-weight-semibold">{user.displayName}</span>
      {/if}
      <span class="has-text-weight-medium">{user.email}</span>
    </header>
    <section class="modal-card-body">
      <div class="settingsContainer">
        <div class="settings">
          <span
            class="icon is-medium"
            on:click={() => {
              console.log('Settings');
            }}>
            <i class="fas fa-cog fas fa-lg " />
          </span>
          <span>Manage Profile</span>
        </div>
      </div>

    </section>
    <footer class="modal-card-foot">
      <button
        class="button is-dark is-rounded"
        class:is-loading={isLoading}
        on:click={logout}>
        Log out
      </button>
    </footer>
  </div>
</div>
