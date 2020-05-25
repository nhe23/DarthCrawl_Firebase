<script>
  import { onMount, onDestroy } from "svelte";
  import { auth } from "../../../conf/firebase";
  import { storageRef } from "../../../conf/firebase";
  import { authState } from "rxfire/auth";
  import ProfilePicture from "../ProfilePicture.svelte";
  import Spinner from "../../utils/Spinner.svelte";
  import CircularProgress from "../../utils/CircularProgress.svelte";
  import { setUserPofilePicture } from "../../../services/firestore";

  export let showChangeProfilePicture = true;
  export let user;

  $: userStorage = `users/${user.uid}`;

  let files;
  let uploadError;
  let imgsLoading = false;
  let isLoading = false;
  let profilePictureSelected;
  let profilePictures = [];
  let uploadProgress;
  let deleteLoading;
  async function setProfilePicture() {
    const setPath = profilePictures.find(
      p => p.imgUrl === profilePictureSelected
    );
    await setUserPofilePicture(setPath.path, user.uid);
    showChangeProfilePicture = false;
  }

  async function deleteFile() {
    deleteLoading = true;
    await storageRef.child(
      profilePictures.find(p => p.imgUrl === profilePictureSelected).path
    ).delete();
    profilePictures = profilePictures.filter(p => p.imgUrl !== profilePictureSelected);
    profilePictureSelected = "";
    // Delete the file
    deleteLoading = false;
  }

  function uploadFiles(e) {
    console.log(e.target.files);
    const file = e.target.files[0];
    if (!file) return console.log("No file seleceted");

    const storagePath = `${userStorage}/${file.name}`;

    var reader = new FileReader();
    let picture = {};

    reader.onload = e => {
      console.log("ON LOAD");
      picture = {
        path: storagePath,
        imgUrl: e.target.result,
        uploadProgress: 0
      };
      profilePictures = [...profilePictures, picture];
    };

    reader.readAsDataURL(e.target.files[0]);

    console.log(profilePictures);
    const uploadTask = storageRef
      .child(`users/${user.uid}/${file.name}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        profilePictures = profilePictures.map(p => {
          if (p.imgUrl === picture.imgUrl) {
            p.uploadProgress = progress;
          }
          return p;
        });
      },
      error => {
        uploadError = error;
      },
      () => {
        profilePictures = profilePictures.map(p => {
          if (p.imgUrl === picture.imgUrl) {
            p.uploadProgress = 101;
          }
          return p;
        });
      }
    );
  }
  onMount(async () => {
    imgsLoading = true;
    const listRes = await storageRef.child("profile_pics_public").listAll();
    const userRes = await storageRef.child(userStorage).listAll();

    const items = [...listRes.items, ...userRes.items];
    const imgPromises = items.map(async i => {
      return { path: i.location.path, imgUrl: await i.getDownloadURL() };
    });

    profilePictures = await Promise.all(imgPromises);
    imgsLoading = false;
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
    position: relative;
    border: 1px solid transparent;
  }

  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .inputfile + label {
    border-radius: 50%;
    margin: 10px;
    height: 80px;
    width: 80px;
    font-size: 1.25em;
    font-weight: 700;
  }

  .fileInputLabel {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
  }

  .inputfile + label {
    cursor: pointer;
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
              {#if profilePicture.uploadProgress !== undefined && profilePicture.uploadProgress <= 100}
                <CircularProgress
                  radius="50"
                  stroke="4"
                  progress={profilePicture.uploadProgress} />
              {/if}
            </div>
          {/each}
          <input
            type="file"
            name="file"
            id="file"
            class="inputfile has-background-black-ter"
            on:change={uploadFiles}
            bind:files />
          <label for="file" class="fileInputLabel has-background-black-ter">
            <i class="fas fa-upload fa-lg" />
          </label>
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
        {#if profilePictureSelected && profilePictures.find(p => p.imgUrl === profilePictureSelected && p.path.includes(userStorage))}
          <button on:click={deleteFile} class="button is-rounded has-text-danger" class:is-loading={deleteLoading}>
            <span class="icon is-small">
              <i class="fas fa-trash" />
            </span>
          </button>
        {/if}
      </div>
    </footer>
  </div>
</div>
