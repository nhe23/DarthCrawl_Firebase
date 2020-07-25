<script>
  import ProfilePciture from "../ProfilePicture.svelte";
  import { userDbData } from "../../../store";

  export let user;
  export let userData;
</script>

<style>
  .profileContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    display: flex;
    align-self: flex-start;
  }
</style>

<section class="hero is-small is-light is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">Profile</h1>
    </div>
  </div>
</section>

<section class="section">
  <div class="container row">
    <div class="column is-6">
      <div class="box profileContainer">
        <ProfilePciture imgSrc={userData.imgSrc} size="L" />
        <div class="row">
          <span title="General Kenobi">Hello there&nbsp;</span>
          <span>{`${user.displayName}`}</span>
        </div>
      </div>
    </div>

    <div class="column is-6">
      <div class="box">
        <div>Quota {userData.quotaUsed}/{userData.quota}</div>
        
      </div>
    </div>

  </div>
</section>
