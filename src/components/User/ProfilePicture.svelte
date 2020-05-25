<script>
  import { createEventDispatcher } from "svelte";
  import { auth } from "../../conf/firebase";
  const dispatch = createEventDispatcher();
  export let imgSrc;
  export let size = "M";
  export let hasCameraIcon = false;
</script>

<style>
  .profileImage {
    border-radius: 50%;
    height: 100%;
    overflow: hidden;
    max-width: max-content;
  }

  .imageBackground {
    cursor: pointer;
    border-radius: 50%;
    z-index: 40;
    position: relative;
    overflow: hidden;
  }

  .backgroundM {
    padding: 3px;
    height: 40px;
    width: 40px;
  }

  .backgroundL {
    padding: 6px;
    height: 80px;
    width: 80px;
  }

  .icon {
    border-radius: 50%;
    position: relative;
    right: 1.5em;
    top: 3em;
    z-index: 50;
    cursor: pointer;
  }

  .profilePictureContainer {
    display: flex;
  }

  .changeProfilePicture {
    margin-left: 1.5em;
  }

  .profilePictures {
    margin: 10px;
  }

  .imageContainer {
    display: flex;
    flex-direction: column;
    border-radius: 50%;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

<div
  class="profilePictureContainer"
  class:changeProfilePicture={hasCameraIcon}
  class:profilePictures={!hasCameraIcon}>
  <div
    class="imageBackground has-background-black-ter background{size.toUpperCase()}"
    on:click={() => {
      dispatch('click');
    }}>
    <div class="imageContainer">
      <img
        class="profileImage"
        type="image/png"
        alt="Profile"
        src={imgSrc ? imgSrc : '/media/profile_pics/user.png'} />
    </div>
  </div>
  {#if hasCameraIcon}
    <span
      class="icon is-medium has-text-black-ter has-background-white-ter"
      on:click={() => {
        dispatch('click');
      }}>
      <i class="fas fa-camera fas fa-lg " />
    </span>
  {/if}
</div>
