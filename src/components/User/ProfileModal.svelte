<script>
  import { onMount } from "svelte";
  import { userDbData } from "../../store";
  import ProfilePicture from "./ProfilePicture.svelte";
  import ProfilePictureModal from "./ChangeProfilePicture/ProfilePictureModal.svelte";
  import { auth, googleProvider } from "../../conf/firebase";
  import { navigate, Link } from "../Router";
  export let user;
  let showProfileMenu = false;
  let isLoading = false;
  let showChangeProfilePicture = false;
  let imgSrc;

  let loadedUserData;
  const userDbData$ = userDbData.subscribe(d => {
    imgSrc = d.imgSrc;
  });

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

{#if showChangeProfilePicture}
  <ProfilePictureModal bind:showChangeProfilePicture {user} />
{/if}

<ProfilePicture
  {imgSrc}
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
      <ProfilePicture
        {imgSrc}
        size="L"
        hasCameraIcon="true"
        on:click={() => {
          showChangeProfilePicture = true;
        }} />
      {#if user.displayName}
        <span class="has-text-weight-semibold">{user.displayName}</span>
      {/if}
      <span class="has-text-weight-medium">{user.email}</span>
    </header>
    <section class="modal-card-body">
      <Link className="has-text-white" to="user/profile">
        <div class="settingsContainer">
          <div
            class="settings"
            on:click={() => {
              showProfileMenu = false;
            }}>
            <span class="icon is-medium">
              <i class="fas fa-cog fas fa-lg " />
            </span>
            <span>Manage Profile</span>
          </div>
        </div>
      </Link>
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
