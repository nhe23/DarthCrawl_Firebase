<script>
  import { onMount, onDestroy } from "svelte";
  import { auth } from "../../../conf/firebase";
  import { storageRef } from "../../../conf/firebase";
  import { authState } from "rxfire/auth";
  import ProfilePicture from "../ProfilePicture.svelte";
  import Spinner from "../../utils/Spinner.svelte";
  import { interval, from, empty, of } from "rxjs";
  import { flatMap, map, startWith, concatAll } from "rxjs/operators";
  import { setUserPofilePicture } from "../../../services/firestore";


  export let showChangeProfilePicture = true;

  let user;
  const unsubscribeUser = authState(auth).subscribe(u => (user = u));
  let imgsLoading = false;
  let isLoading = false;
  let profilePictureSelected = "";
  let profilePictures = [];

  async function setProfilePicture() {
    const setPath = profilePictures.find(
      p => p.imgUrl === profilePictureSelected
    );
    await setUserPofilePicture(setPath.path, user.uid);
    showChangeProfilePicture=false;
  }

  onMount(async () => {
    imgsLoading = true;
    const listRef = storageRef.child("profile_pics_public");

    // Find all the prefixes and items.
    const res = await listRef.listAll();
    const imgPromises = res.items.map(async i => {
      return { path: i.location.path, imgUrl: await i.getDownloadURL() };
    });

    profilePictures = await Promise.all(imgPromises);
    imgsLoading = false;
  });

  onDestroy(() => {
    unsubscribeUser.unsubscribe();
  });
</script>

<style>
  .modal {
    z-index: 100;
  }
  .footerContainer {
    display: flex;
    align-items: center;
  }

  .modal-card {
    max-width: 600px;
  }

  .spinnerContainer {
    display: flex;
    justify-content: center;
  }

  .imgsContainer {
    display: flex;
    flex-wrap: wrap;
  }

  .selected {
    border-radius: 50%;
    border: 1px solid !important;
  }

  .profilePictureContainer {
    border-radius: 50%;
    border: 1px solid transparent;
  }
</style>

<div class="modal is-active" class:is-active={showChangeProfilePicture}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <span class="modal-card-title has-text-white">
        Select profile picture
      </span>

      <button
        class="delete"
        aria-label="close"
        on:click={() => (showChangeProfilePicture = false)} />
    </header>
    <section class="modal-card-body">
      {#if imgsLoading}
        <div class="spinnerContainer">
          <Spinner />
        </div>
      {:else}
        <div class="imgsContainer">
          {#each profilePictures as profilePicture}
            <div
              class:selected={profilePictureSelected === profilePicture.imgUrl}
              class="profilePictureContainer">
              <ProfilePicture
                on:click={() => {
                  profilePictureSelected = profilePicture.imgUrl;
                }}
                imgSrc={profilePicture.imgUrl}
                size="L" />
            </div>
          {/each}
        </div>
      {/if}
    </section>
    <footer class="modal-card-foot">
      <div class="footerContainer">
        <button
          class="button is-primary is-rounded"
          type="submit"
          disabled={!profilePictureSelected}
          class:is-loading={isLoading}
          on:click={setProfilePicture}>
          Change profile picture
        </button>
        <button
          class="button is-rounded"
          on:click={() => (showChangeProfilePicture = false)}>
          Cancel
        </button>
      </div>
    </footer>
  </div>
</div>
