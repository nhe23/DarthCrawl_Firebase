<script>
  import { onDestroy } from "svelte";
  import Signup from "../User/Signup/Signup.svelte";

  import { auth, googleProvider } from "../../conf/firebase";
  import { authState } from "rxfire/auth";
  import Login from "../User/Login.svelte";
  import ProfileModal from "../User/ProfileModal.svelte";

  let user;

  const unsubscribeUser = authState(auth).subscribe((u) => (user = u));


  onDestroy(() => {
    unsubscribeUser.unsubscribe();
  });
</script>

<style>

</style>

<div>
  {#if user}
    <ProfileModal {user} />
  {:else}
    <div class="buttons">
      <Login />
      <Signup />
    </div>
  {/if}
</div>
